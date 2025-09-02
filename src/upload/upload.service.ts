import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { UsersService } from '../users/users.service';
import { CitiesService } from '../cities/cities.service';

@Injectable()
export class UploadService {
  constructor(
    private cloudinaryService: CloudinaryService,
    private usersService: UsersService,
    private citiesService: CitiesService,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'images',
  ): Promise<string> {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only image files are allowed (JPEG, PNG, GIF, WebP)',
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must be less than 5MB');
    }

    return await this.cloudinaryService.uploadFile(file, folder);
  }

  async uploadProfilePicture(userId: number, file: Express.Multer.File): Promise<string> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const url = await this.uploadImage(file, 'avatars');
    await this.usersService.update(userId, { profilePicture: url });

    return url;
  }
}