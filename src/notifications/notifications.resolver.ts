import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { GraphQLJwtAuthGuard } from '../auth/graphql-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

const pubSub = new PubSub();

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Query(() => [Notification])
  @UseGuards(GraphQLJwtAuthGuard)
  async myNotifications(@CurrentUser() user: User): Promise<Notification[]> {
    return this.notificationsService.findUserNotifications(user.id);
  }

  @Query(() => Number)
  @UseGuards(GraphQLJwtAuthGuard)
  async unreadCount(@CurrentUser() user: User): Promise<number> {
    return this.notificationsService.getUnreadCount(user.id);
  }

  @Mutation(() => Notification)
  @UseGuards(GraphQLJwtAuthGuard)
  async createNotification(@Args('createNotificationInput') createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = await this.notificationsService.create(createNotificationDto);
    pubSub.publish('notificationAdded', { notificationAdded: notification });
    return notification;
  }

  @Mutation(() => Notification)
  @UseGuards(GraphQLJwtAuthGuard)
  async markNotificationRead(@Args('id') id: number): Promise<Notification> {
    return this.notificationsService.markAsRead(id);
  }

  @Subscription(() => Notification, {
    filter: (payload, variables, context) => {
      // Allow all for now - you can add filtering logic here
      return true;
    },
  })
  notificationAdded() {
    return pubSub.asyncIterableIterator('notificationAdded');
  }
}