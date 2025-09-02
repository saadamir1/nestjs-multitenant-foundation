import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UploadService } from './upload.service';

@Resolver()
export class UploadResolver {
  constructor(private uploadService: UploadService) {}

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async uploadProfilePicture(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
    @CurrentUser() user: any,
  ): Promise<string> {
    const { createReadStream, filename, mimetype } = await file;
    const stream = createReadStream();
    
    // Convert stream to buffer for Cloudinary
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    const multerFile: Express.Multer.File = {
      buffer,
      originalname: filename,
      mimetype,
      size: buffer.length,
      fieldname: 'file',
      encoding: '7bit',
      destination: '',
      filename: '',
      path: '',
      stream: null,
    };

    return this.uploadService.uploadProfilePicture(user.userId, multerFile);
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async uploadImage(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<string> {
    const { createReadStream, filename, mimetype } = await file;
    const stream = createReadStream();
    
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    const multerFile: Express.Multer.File = {
      buffer,
      originalname: filename,
      mimetype,
      size: buffer.length,
      fieldname: 'file',
      encoding: '7bit',
      destination: '',
      filename: '',
      path: '',
      stream: null,
    };

    return this.uploadService.uploadImage(multerFile, 'images');
  }
}