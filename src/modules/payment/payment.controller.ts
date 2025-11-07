import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
  async createCheckout(@Body() body: CreateCheckoutDto) {
    return this.paymentService.createCheckoutSession(
      body.amount,
      body.currency,
      body.productName,
    );
  }
}
