import { Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(BadRequestException)
export class GraphQLValidationFilter implements GqlExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const response = exception.getResponse() as any;
    
    // Handle validation errors
    if (Array.isArray(response.message)) {
      const validationErrors = response.message.join(', ');
      return new GraphQLError(validationErrors, {
        extensions: {
          code: 'VALIDATION_ERROR',
          statusCode: 400,
        },
      });
    }
    
    // Handle other bad request errors
    return new GraphQLError(response.message || exception.message, {
      extensions: {
        code: 'BAD_REQUEST',
        statusCode: 400,
      },
    });
  }
}