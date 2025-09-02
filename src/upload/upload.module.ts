import { Module } from '@nestjs/common';
import { UploadResolver } from './upload.resolver';
import { UploadService } from './upload.service';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { UsersModule } from '../users/users.module';
import { CitiesModule } from '../cities/cities.module';

@Module({
  imports: [UsersModule, CitiesModule],
  providers: [UploadResolver, UploadService, CloudinaryService],
  exports: [UploadService, CloudinaryService],
})
export class UploadModule {}