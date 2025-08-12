import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * JWT Auth Guard that protects routes using the 'jwt' strategy.
 * It triggers the JwtStrategy, which validates the token and attaches the payload to request.user.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
/**
 * Usage:
 *
 * @Query(() => User)
 * @UseGuards(JwtAuthGuard)
 * async me(@CurrentUser() user: any): Promise<User> {
 *   return user; // Returns the authenticated user object
 * }
 */
