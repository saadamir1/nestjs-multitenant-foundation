import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { AuditLog } from '../../common/entities/audit-log.entity';

@ObjectType()
export class DashboardStats {
  @Field(() => Int)
  totalUsers: number;

  @Field(() => Int)
  totalCities: number;

  @Field(() => Int)
  totalRooms: number;

  @Field(() => Int)
  totalMessages: number;

  @Field(() => Int)
  totalNotifications: number;

  @Field(() => [User])
  recentUsers: User[];

  @Field(() => [AuditLog])
  recentActivity: AuditLog[];
}

@ObjectType()
export class UserGrowthData {
  @Field()
  date: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class ActivityData {
  @Field()
  action: string;

  @Field(() => Int)
  count: number;
}