import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreatePaymentInput {
  @Field()
  amount: number;

  @Field({ defaultValue: 'usd' })
  currency: string;

  @Field({ nullable: true })
  description?: string;
}

@ObjectType()
export class PaymentIntentResponse {
  @Field()
  clientSecret: string;

  @Field()
  paymentIntentId: string;
}

@ObjectType()
export class MessageResponse {
  @Field()
  message: string;
}