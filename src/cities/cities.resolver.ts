import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { City } from './entities/city.entity';
import { PaginatedCities } from './dto/paginated-cities';
import { CreateCityInput, UpdateCityInput, CitiesFilterInput } from './dto/graphql-inputs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => City)
export class CitiesResolver {
  constructor(private readonly citiesService: CitiesService) {}

  @Query(() => PaginatedCities)
  @UseGuards(JwtAuthGuard)
  async cities(
    @Args('filter', { nullable: true }) filter?: CitiesFilterInput,
  ): Promise<PaginatedCities> {
    const page = filter?.page || 1;
    const limit = filter?.limit || 10;
    return this.citiesService.findAll(page, limit);
  }

  @Query(() => City, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async city(@Args('id', { type: () => ID }) id: number): Promise<City | null> {
    return this.citiesService.findOne(id);
  }

  @Mutation(() => City)
  @UseGuards(JwtAuthGuard)
  async createCity(@Args('createCityInput') createCityInput: CreateCityInput): Promise<City> {
    return this.citiesService.create(createCityInput);
  }

  @Mutation(() => City)
  @UseGuards(JwtAuthGuard)
  async updateCity(
    @Args('id', { type: () => ID }) id: number,
    @Args('updateCityInput') updateCityInput: UpdateCityInput,
  ): Promise<City> {
    return this.citiesService.update(id, updateCityInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteCity(@Args('id', { type: () => ID }) id: number): Promise<boolean> {
    await this.citiesService.remove(id);
    return true;
  }
}