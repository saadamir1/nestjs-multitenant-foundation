import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ChatMessage } from './chat-message.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';

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

  @Field(() => Workspace)
  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspaceId' })
  workspace: Workspace;

  @Column()
  workspaceId: number;
}
