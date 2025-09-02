import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { CreatePaymentInput, PaymentIntentResponse, MessageResponse } from './dto/payment.dto';

@Resolver(() => Payment)
@UseGuards(JwtAuthGuard)
export class PaymentsResolver {
  constructor(private paymentsService: PaymentsService) {}

  @Mutation(() => PaymentIntentResponse)
  async createPaymentIntent(
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput,
    @CurrentUser() user: any,
  ): Promise<PaymentIntentResponse> {
    return this.paymentsService.createPaymentIntent(user.userId, createPaymentInput);
  }

  @Mutation(() => MessageResponse)
  async confirmPayment(
    @Args('paymentIntentId') paymentIntentId: string,
  ): Promise<MessageResponse> {
    return this.paymentsService.confirmPayment(paymentIntentId);
  }

  @Query(() => [Payment])
  async myPayments(@CurrentUser() user: any): Promise<Payment[]> {
    return this.paymentsService.getUserPayments(user.userId);
  }

  @Query(() => [Payment])
  @UseGuards(RolesGuard)
  @Roles('admin')
  async allPayments(): Promise<Payment[]> {
    return this.paymentsService.getAllPayments();
  }
}