import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'cities' })
export class City {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @Field()
  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  country: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
