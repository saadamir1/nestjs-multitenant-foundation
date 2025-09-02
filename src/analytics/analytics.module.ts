import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsResolver } from './analytics.resolver';
import { AnalyticsService } from './analytics.service';
import { User } from '../users/entities/user.entity';
import { City } from '../cities/entities/city.entity';
import { AuditLog } from '../common/entities/audit-log.entity';
import { ChatRoom } from '../chat/entities/chat-room.entity';
import { ChatMessage } from '../chat/entities/chat-message.entity';
import { Notification } from '../notifications/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      City,
      AuditLog,
      ChatRoom,
      ChatMessage,
      Notification,
    ]),
  ],
  providers: [AnalyticsResolver, AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
