import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput, UpdateProfileInput, ChangePasswordInput } from './dto/graphql-inputs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async users(): Promise<User[]> {
    const result = await this.usersService.findAll();
    return Array.isArray(result) ? result : result.data;
  }

  @Query(() => User, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async user(@Args('id', { type: () => ID }) id: number): Promise<User | null> {
    return this.usersService.findOne(id);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: any): Promise<User> {
    const fullUser = await this.usersService.findOne(user.userId);
    if (!fullUser) {
      throw new Error('User not found');
    }
    const { password, refreshToken, ...userProfile } = fullUser;
    return userProfile as User;
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: any,
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
  ): Promise<User> {
    return this.usersService.updateProfile(user.userId, updateProfileInput);
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() user: any,
    @Args('changePasswordInput') changePasswordInput: ChangePasswordInput,
  ): Promise<string> {
    await this.usersService.changePassword(user.userId, changePasswordInput);
    return 'Password changed successfully';
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteUser(@Args('id', { type: () => ID }) id: number): Promise<boolean> {
    await this.usersService.remove(id);
    return true;
  }
}