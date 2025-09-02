import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { City } from '../cities/entities/city.entity';
import { AuditLog } from '../common/entities/audit-log.entity';
import { ChatRoom } from '../chat/entities/chat-room.entity';
import { ChatMessage } from '../chat/entities/chat-message.entity';
import { Notification } from '../notifications/entities/notification.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
    @InjectRepository(ChatRoom)
    private roomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private messageRepository: Repository<ChatMessage>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalCities,
      totalRooms,
      totalMessages,
      totalNotifications,
      recentUsers,
      recentActivity,
    ] = await Promise.all([
      this.userRepository.count(),
      this.cityRepository.count(),
      this.roomRepository.count(),
      this.messageRepository.count(),
      this.notificationRepository.count(),
      this.userRepository.find({
        order: { id: 'DESC' },
        take: 5,
        select: ['id', 'email', 'firstName', 'lastName', 'role'],
      }),
      this.auditRepository.find({
        order: { createdAt: 'DESC' },
        take: 10,
        relations: ['user'],
      }),
    ]);

    return {
      totalUsers,
      totalCities,
      totalRooms,
      totalMessages,
      totalNotifications,
      recentUsers,
      recentActivity,
    };
  }

  async getUserGrowth(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const users = await this.userRepository
      .createQueryBuilder('user')
      .select('DATE(user.id)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('user.id >= :startDate', { startDate })
      .groupBy('DATE(user.id)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return users;
  }

  async getActivityStats(userId?: number) {
    const query = this.auditRepository.createQueryBuilder('audit');

    if (userId) {
      query.where('audit.userId = :userId', { userId });
    }

    const activities = await query
      .select('audit.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .groupBy('audit.action')
      .getRawMany();

    return activities;
  }
}
