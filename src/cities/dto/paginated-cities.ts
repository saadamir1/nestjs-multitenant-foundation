import { ObjectType, Field, Int } from '@nestjs/graphql';
import { City } from '../entities/city.entity';

@ObjectType()
export class PaginatedCities {
  @Field(() => [City])
  data: City[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  lastPage: number;
}