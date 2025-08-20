import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNumber } from 'class-validator';

@InputType()
export class CreateNotificationDto {
  @Field()
  @IsNumber()
  userId: number;

  @Field()
  @IsString()
  type: string;

  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  message: string;
}
