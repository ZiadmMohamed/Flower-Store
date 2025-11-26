import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepo } from './orders.repo';
import { ORDER_STATUS, OrderType, PAYMENT_STATUS } from './schema/order.schema';
import { CreateOrderDto, PAYMENT_METHODS } from './dto/create-order.dto';
import { Types } from 'mongoose';
import { ProductService } from '../product/product.service';
import { productDocument } from '../product/schema/product.model';
import { OrderCalculation } from './dto/order';
import { CartRepo } from '../cart/cart.repo';
import { CreateCartProductItem } from '../cart/dto/create-cart.dto';
import { Ipaginate } from 'src/utils/base.repo';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CHECKOUT_JOB, ORDER_QUEUE } from './order.constants';
import {
  EnqueueCheckoutResponse,
  EnqueueCheckoutStatus,
} from './dto/enqueue-checkout';
import { GetOrderStatusResponse } from './dto/get-order-status.response';
import { UserType } from '../users/schema/user.schema';
import { PaymentService } from 'src/common/payment/payment.service';
import { ProductRepo } from '../product/product.repo';
import { Request } from 'express';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private orderRepo: OrderRepo,
    private productService: ProductService,
    private cartRepo: CartRepo,
    private paymentService: PaymentService,
    private productRepo: ProductRepo,
    @InjectQueue(ORDER_QUEUE) private orderQueue: Queue,
  ) {}

  async enqueueCheckout(
    createOrderDTO: CreateOrderDto,
    userId: Types.ObjectId,
  ): Promise<EnqueueCheckoutResponse> {
    try {
      const job = await this.orderQueue.add(
        CHECKOUT_JOB,
        {
          dto: createOrderDTO,
          userId: userId.toString(),
        },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: 100,
          removeOnFail: 500,
        },
      );

      this.logger.log(
        `Order checkout job enqueued successfully. JobId: ${job.id}`,
      );

      return {
        jobId: job.id as string,
        status: EnqueueCheckoutStatus.QUEUED,
        message: 'Order is being processed',
      };
    } catch (error) {
      this.logger.error(
        `Failed to enqueue checkout job for user ${userId}: ${error.message}`,
      );
      throw error;
    }
  }

  async getJobStatus(jobId: string): Promise<GetOrderStatusResponse> {
    const job = await this.orderQueue.getJob(jobId);

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    const state = await job.getState();
    const progress = job.progress;
    const returnValue = job.returnvalue;
    const failedReason = job.failedReason;

    return {
      id: job.id,
      state,
      progress,
      result: returnValue,
      failedReason,
    };
  }
  async processOrder(
    createOrderDTO: CreateOrderDto,
    userId: Types.ObjectId,
  ): Promise<OrderType> {
    const cart = await this.cartRepo.findOne({
      filters: { userId: userId.toString() },
    });

    if (!cart || cart.products.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    const products = await this.productService.validateProductsStock(
      cart.products,
    );
    await this.productService.decreaseProductsStock(cart.products);

    const orderCalculation = this.calculateOrderTotal(products, cart.products);
    // TODO: Implement promo code validation and discount logic
    // 3. Validate and apply promo code if provided
    // if (createOrderDTO.promoCode) {
    //   await this.applyPromoCode(createOrderDTO.promoCode, orderCalculation);
    // }

    const orderNumber = await this.generateOrderNumber();

    const order = await this.orderRepo.create({
      orderNumber,
      userId,
      ...createOrderDTO,
      ...orderCalculation,
      orderStatus: ORDER_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.UNPAID,
    });

    const savedOrder = await this.orderRepo.save(order);

    await this.cartRepo.deleteOne({ _id: cart._id });

    // TODO: Send order confirmation email/notification
    // await this.notificationService.sendOrderConfirmation(savedOrder);

    return savedOrder;
  }

  async getOrders(userId: Types.ObjectId): Promise<Ipaginate<OrderType>> {
    const orders = (await this.orderRepo.find({
      filters: { userId },
    })) as Ipaginate<OrderType>;

    if (!orders?.data?.length) throw new NotFoundException('No orders found');

    return orders;
  }

  private calculateOrderTotal(
    products: productDocument[],
    orderItems: CreateCartProductItem[],
  ): OrderCalculation {
    const productsWithPrices = orderItems.map(item => {
      const product = products.find(
        p => p._id.toString() === item.productId.toString(),
      );

      const priceAtPurchase = product.finalPrice || product.originalPrice;
      const subtotal = priceAtPurchase * item.quantity;

      return {
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase,
        subtotal,
      };
    });

    const subtotal = productsWithPrices.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    );

    return {
      products: productsWithPrices,
      subtotal,
      discount: 0,
      total: subtotal,
    };
  }

  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const todayOrdersCount = await this.orderRepo.count({
      filters: {
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      },
    });

    const sequence = String(todayOrdersCount + 1).padStart(6, '0');
    return `ORD-${dateStr}-${sequence}`;
  }

  // private async applyPromoCode(690b7d3474e49ff22cd27006
  //   promoCode: string,
  //   calculation: OrderCalculation,
  // ): Promise<void> {
  //   // TODO: Implement promo code validation and discount logic
  //   // 1. Validate promo code exists and is active
  //   // 2. Check if it's expired
  //   // 3. Check usage limits
  //   // 4. Calculate discount based on promo type (percentage/fixed)
  //   // 5. Update calculation.discount and calculation.total

  //   if (promoCode.toUpperCase() === 'WELCOME10') {
  //     calculation.discount = calculation.subtotal * 0.1;
  //     calculation.total = calculation.subtotal - calculation.discount;
  //   }
  // }

  async checkout(orderId: Types.ObjectId, user: UserType) {
    const orderDoc = await this.orderRepo.findOne({
      filters: {
        _id: orderId,
        orderStatus: ORDER_STATUS.PENDING,
        paymentStatus: PAYMENT_STATUS.UNPAID,
        paymentMethod: PAYMENT_METHODS.CREDIT_CARD,
      },
    });

    const order = orderDoc.toObject ? orderDoc.toObject() : orderDoc;
    console.log(order);

    if (!order) {
      throw new NotFoundException(
        'Order not found, already paid, or payment method is cash/invalid.',
      );
    }

    const line_items = [];

    // 2. Use the robust FOR...OF loop for asynchronous lookup
    for (const p of order.products) {
      const { productId, quantity, priceAtPurchase } = p;

      // Lookup the product name
      const product = await this.productRepo.findOne({
        filters: { _id: productId },
      });
      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found.`);
      }

      // Price calculation: ensures safety against NaN
      const safePrice = Number(priceAtPurchase);
      const safeQuantity = Number(quantity);
      const priceInPiasters = Math.round(safePrice * 100);

      if (priceInPiasters <= 0) {
        throw new Error(
          `Invalid price detected for product ${product.productName}`,
        );
      }

      line_items.push({
        quantity: safeQuantity,
        price_data: {
          unit_amount: priceInPiasters,
          currency: 'egp',
          product_data: {
            name: product.productName,
          },
        },
      });
    }

    // 3. Create Stripe Checkout Session
    const session = await this.paymentService.checkoutsession({
      customer_email: user.email,
      line_items,
      metadata: { orderId: orderId as unknown as string },
      cancel_url: `${process.env.cancel_url}/order/${orderId}/cancel`,
      success_url: `${process.env.success_url}/order/${orderId}/success`,
      payment_method_types: ['card'],
    });
    const intent = await this.paymentService.createPaymentIntent(
      order.total * 100,
    );
    await this.orderRepo.updateOne({ _id: orderId }, { intentId: intent.id });

    return session;
  }

  webhook(req: Request) {
    return this.paymentService.webhook(req);
  }

  async cancelOrder(orderId: Types.ObjectId, user: UserType) {
    console.log(orderId, user.id);
    if (!isValidObjectId(orderId)) {
      // This should ideally be caught by a pipe, but serves as a backup.
      throw new BadRequestException('Invalid Order ID provided.');
    }
    const order = await this.orderRepo.findOne({
      filters: {
        _id: new Types.ObjectId(orderId),
        userId: user._id,
        $or: [
          { orderStatus: ORDER_STATUS.PENDING },
          { orderStatus: ORDER_STATUS.CONFIRMED },
        ],
      },
    });
    console.log('order1', order);

    if (!order) {
      throw new NotFoundException('order is not found');
    }
    console.log('order', order);

    let refund = {};
    if (
      order.paymentMethod === PAYMENT_METHODS.CREDIT_CARD &&
      order.orderStatus === ORDER_STATUS.CONFIRMED
    ) {
      await this.paymentService.refund(order.intentId);
      refund = { refundAmount: order.total, refundAt: Date.now() };
      for (const product of order.products) {
        await this.productRepo.updateOne(
          { _id: product.productId },
          { $inc: { stock: product.quantity } },
        );
      }
      await this.orderRepo.updateOne(
        { _id: orderId, createdBy: user._id },
        { orderStatus: ORDER_STATUS.CANCELLED, ...refund },
      );
    }
    console.log(refund);
    for (const product of order.products) {
      await this.productRepo.updateOne(
        { _id: product.productId },
        { $inc: { stock: product.quantity } },
      );
    }
    await this.orderRepo.updateOne(
      { _id: new Types.ObjectId(orderId), userId: user._id },
      { orderStatus: ORDER_STATUS.CANCELLED },
    );

    return 'done';
  }
}
