import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNumber } from 'class-validator';

@InputType()
export class SendMessageDto {
  @Field()
  @IsString()
  content: string;

  @Field()
  @IsNumber()
  roomId: number;
}
