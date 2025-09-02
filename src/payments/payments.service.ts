import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Payment } from './entities/payment.entity';
import { CreatePaymentInput } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      { apiVersion: '2023-10-16' },
    );
  }

  async createPaymentIntent(
    userId: number,
    createPaymentInput: CreatePaymentInput,
  ) {
    const { amount, currency, description } = createPaymentInput;

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      description,
      metadata: { userId: userId.toString() },
    });

    const payment = this.paymentRepository.create({
      stripePaymentIntentId: paymentIntent.id,
      amount,
      currency,
      description,
      userId,
    });

    await this.paymentRepository.save(payment);

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  async confirmPayment(paymentIntentId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentIntentId: paymentIntentId },
    });

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Map Stripe status to our enum
    const statusMap = {
      'succeeded': 'completed',
      'processing': 'pending', 
      'requires_payment_method': 'failed',
      'requires_confirmation': 'pending',
      'requires_action': 'pending',
      'canceled': 'failed'
    };
    
    payment.status = statusMap[paymentIntent.status] || 'pending';
    await this.paymentRepository.save(payment);

    return { message: `Payment ${paymentIntent.status}` };
  }

  async getUserPayments(userId: number) {
    return this.paymentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getAllPayments() {
    return this.paymentRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}