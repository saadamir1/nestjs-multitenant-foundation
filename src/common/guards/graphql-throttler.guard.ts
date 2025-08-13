import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GraphQLThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    
    // Ensure req has all necessary properties for throttler
    if (ctx.req) {
      // Add missing methods if they don't exist
      if (!ctx.req.header && ctx.req.headers) {
        ctx.req.header = function(name: string) {
          return this.headers[name.toLowerCase()];
        };
      }
      
      // Ensure IP is available
      if (!ctx.req.ip) {
        ctx.req.ip = ctx.req.connection?.remoteAddress || 
                     ctx.req.socket?.remoteAddress || 
                     '127.0.0.1';
      }
    }
    
    return { req: ctx.req, res: ctx.res };
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req?.ip || req?.connection?.remoteAddress || req?.socket?.remoteAddress || '127.0.0.1';
  }
}