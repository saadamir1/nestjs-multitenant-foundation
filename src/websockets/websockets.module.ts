import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { WebSocketsGateway } from './websockets.gateway';
import { ChatModule } from '../chat/chat.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [JwtModule, ChatModule, NotificationsModule],
  providers: [WebSocketsGateway],
})
export class WebSocketsModule {}