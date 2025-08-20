import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from '../chat/chat.service';
import { NotificationsService } from '../notifications/notifications.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebSocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private connectedUsers = new Map<string, number>();

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
    private notificationsService: NotificationsService,
  ) {}
  
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token);
      this.connectedUsers.set(client.id, payload.sub);
      console.log(`User ${payload.sub} connected: ${client.id}`);
    } catch (error) {
      console.log('Unauthorized connection attempt');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    this.connectedUsers.delete(client.id);
    console.log(`User ${userId} disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(@MessageBody() roomId: number, @ConnectedSocket() client: Socket) {
    client.join(`room-${roomId}`);
    console.log(`Client ${client.id} joined room ${roomId}`);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(@MessageBody() roomId: number, @ConnectedSocket() client: Socket) {
    client.leave(`room-${roomId}`);
    console.log(`Client ${client.id} left room ${roomId}`);
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    @MessageBody() data: { content: string; roomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.connectedUsers.get(client.id);
    if (!userId) return;

    const message = await this.chatService.sendMessage(data, userId);
    client.to(`room-${data.roomId}`).emit('new-message', message);
  }

  async sendNotification(userId: number, notification: any) {
    const userSocket = Array.from(this.connectedUsers.entries())
      .find(([_, id]) => id === userId)?.[0];
    
    if (userSocket) {
      const client = this.server.sockets.sockets.get(userSocket);
      client?.emit('new-notification', notification);
    }
  }

  private server: any;
  afterInit(server: any) {
    this.server = server;
  }
}