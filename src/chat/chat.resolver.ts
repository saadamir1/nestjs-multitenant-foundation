import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { ChatService } from './chat.service';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

const pubSub = new PubSub();

@Resolver(() => ChatRoom)
@UseGuards(JwtAuthGuard)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Query(() => [ChatRoom])
  async myRooms(@CurrentUser() user: User): Promise<ChatRoom[]> {
    return this.chatService.findUserRooms(user.id);
  }

  @Query(() => [ChatMessage])
  async roomMessages(@Args('roomId') roomId: number): Promise<ChatMessage[]> {
    return this.chatService.getRoomMessages(roomId);
  }

  @Mutation(() => ChatRoom)
  async createRoom(
    @Args('createRoomInput') createRoomDto: CreateRoomDto,
  ): Promise<ChatRoom> {
    return this.chatService.createRoom(createRoomDto);
  }

  @Mutation(() => ChatMessage)
  async sendMessage(
    @Args('sendMessageInput') sendMessageDto: SendMessageDto,
    @CurrentUser() user: User,
  ): Promise<ChatMessage> {
    const message = await this.chatService.sendMessage(sendMessageDto, user.id);
    pubSub.publish('messageAdded', { messageAdded: message });
    return message;
  }

  @Subscription(() => ChatMessage)
  messageAdded() {
    return pubSub.asyncIterableIterator('messageAdded');
  }
}
