import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Custom decorator that extracts the authenticated user from GraphQL context.
 * Handles the authenticated user set by JWT strategy.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    // Check if it's a GraphQL context
    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext();

    if (ctx && ctx.req) {
      return ctx.req.user;
    }

    // Fallback for non-GraphQL contexts
    const request = context.switchToHttp().getRequest();
    return request?.user;
  },
);
/**
 * Usage:
 *
 * @Query(() => User)
 * @UseGuards(JwtAuthGuard)
 * async me(@CurrentUser() user: any): Promise<User> {
 *   return user; // Returns the authenticated user object
 * }
 */
