import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// GraphQL upload temporarily removed due to dependency conflicts
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UploadService } from './upload.service';

@Resolver()
export class UploadResolver {
  constructor(private uploadService: UploadService) {}

  // GraphQL file upload mutations temporarily disabled due to dependency conflicts
  // Will be re-enabled after resolving graphql-upload version conflicts
}