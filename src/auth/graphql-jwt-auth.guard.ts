import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GraphQLJwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    
    // For subscriptions, skip JWT validation
    if (!request) {
      return null;
    }
    
    return request;
  }

  canActivate(context: ExecutionContext) {
    const request = this.getRequest(context);
    
    // Skip authentication for subscriptions
    if (!request) {
      return true;
    }
    
    return super.canActivate(context);
  }
}