import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ChatMessage } from './chat-message.entity';

@Entity('chat_rooms')
@ObjectType()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column('int', { array: true })
  @Field(() => [Number])
  participantIds: number[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @OneToMany(() => ChatMessage, (message) => message.room)
  @Field(() => [ChatMessage])
  messages: ChatMessage[];
}
