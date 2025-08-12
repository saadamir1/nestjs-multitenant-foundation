import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Custom decorator that extracts the authenticated user from the request.
 * Works with both REST and GraphQL contexts.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    // Check if it's a GraphQL context
    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext();
    
    if (ctx && ctx.req) {
      return ctx.req.user;
    }
    
    // Fallback to HTTP context for REST endpoints
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
/**
 * Usage:
 *
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * getProfile(@CurrentUser() user: any) {
 *   return user; // Returns the authenticated user object
 * }
 */
