import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { Request } from 'express';
import { OrderRepo } from 'src/modules/orders/orders.repo';
import { ORDER_STATUS } from 'src/modules/orders/schema/order.schema';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor(private orderRepo: OrderRepo) {
    this.stripe = new Stripe(process.env.secret_stripe as string);
  }

  async checkoutsession({
    customer_email,
    mode = 'payment',
    cancel_url = process.env.cancel_url,
    success_url = process.env.success_url,
    metadata = {},
    line_items,

    payment_method_types,
  }: Stripe.Checkout.SessionCreateParams): Promise<
    Stripe.Response<Stripe.Checkout.Session>
  > {
    const session = await this.stripe.checkout.sessions.create({
      customer_email,
      mode,
      cancel_url,
      success_url,
      metadata,
      line_items,

      payment_method_types,
    });

    return session;
  }

  async createcoupon(
    params: Stripe.CouponCreateParams,
  ): Promise<Stripe.Response<Stripe.Coupon>> {
    const coupon = await this.stripe.coupons.create(params);
    return coupon;
  }

  async webhook(req: Request) {
    const sig = req.headers['stripe-signature'];
    const body = req.body; // Raw Buffer (not parsed JSON)

    if (!sig) {
      throw new BadRequestException('Missing Stripe signature header');
    }
    const endpointsecret = process.env.stripe_webhook_signin_secret as string;

    const event = this.stripe.webhooks.constructEvent(
      body,
      sig,
      endpointsecret,
    );
    if (!event) {
      throw new NotFoundException('event is not exist');
    }

    // Handle Stripe event (e.g., payment success)
    if (event.type != 'checkout.session.completed') {
      await this.orderRepo.updateOne(
        {
          _id: event.data.object['metadata'].orderId,
          orderStatus: ORDER_STATUS.PENDING,
        },
        { orderStatus: ORDER_STATUS.CANCELLED, rejectedReason: 'fail to pay' },
      );

      throw new BadRequestException('fail to pay');
    }
    const order = await this.orderRepo.findOne({
      filters: { id: event.data.object['metadata']?.orderId },
    });
    if (!order) {
      throw new NotFoundException('order id is not avaialbe');
    }
    await this.confirmPaymenIntent(order.intentId);
    await this.orderRepo.updateOne(
      {
        _id: event.data.object.metadata?.orderId,
        orderStatus: ORDER_STATUS.PENDING,
      },
      { orderStatus: ORDER_STATUS.CONFIRMED, paidAt: new Date(Date.now()) },
    );

    return 'done';
  }

  async createPaymentIntent(amount: number, currency: string = 'egp') {
    const paymentMethod = await this.paymentMethod();
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      payment_method: paymentMethod.id,
    });
    return paymentIntent;
  }
  async paymentMethod(token: string = 'tok_visa') {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: { token },
    });
    return paymentMethod;
  }

  async retrivePaymentIntent(
    id: string,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(id);
    return paymentIntent;
  }

  async confirmPaymenIntent(id: string) {
    const intent = await this.retrivePaymentIntent(id);
    if (!intent) {
      throw new BadRequestException('intent is not exist');
    }
    const paymentintentconfirm = await this.stripe.paymentIntents.confirm(
      intent.id,
      { payment_method: 'pm_card_visa' },
    );
    if (paymentintentconfirm.status != 'succeeded') {
      throw new BadRequestException('fail to confirm intent id');
    }
  }

  async refund(id: string) {
    const refund = await this.stripe.refunds.create({ payment_intent: id });
    return refund;
  }
}
