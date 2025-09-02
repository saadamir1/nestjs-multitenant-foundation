import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AnalyticsService } from './analytics.service';
import { DashboardStats, UserGrowthData, ActivityData } from './dto/analytics.dto';

@Resolver()
@UseGuards(JwtAuthGuard)
export class AnalyticsResolver {
  constructor(private analyticsService: AnalyticsService) {}

  @Query(() => DashboardStats)
  @UseGuards(RolesGuard)
  @Roles('admin')
  async dashboardStats(): Promise<DashboardStats> {
    return this.analyticsService.getDashboardStats();
  }

  @Query(() => [UserGrowthData])
  @UseGuards(RolesGuard)
  @Roles('admin')
  async userGrowth(
    @Args('days', { type: () => Int, defaultValue: 30 }) days: number,
  ): Promise<UserGrowthData[]> {
    return this.analyticsService.getUserGrowth(days);
  }

  @Query(() => [ActivityData])
  async myActivity(@CurrentUser() user: any): Promise<ActivityData[]> {
    return this.analyticsService.getActivityStats(user.userId);
  }

  @Query(() => [ActivityData])
  @UseGuards(RolesGuard)
  @Roles('admin')
  async allActivity(): Promise<ActivityData[]> {
    return this.analyticsService.getActivityStats();
  }
}