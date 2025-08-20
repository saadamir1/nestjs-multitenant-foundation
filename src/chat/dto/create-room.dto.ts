import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsArray, IsOptional } from 'class-validator';

@InputType()
export class CreateRoomDto {
  @Field()
  @IsString()
  name: string;

  @Field(() => [Number])
  @IsArray()
  participantIds: number[];
}
