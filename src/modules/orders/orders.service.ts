import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepo } from './orders.repo';
import { ORDER_STATUS, OrderType, PAYMENT_STATUS } from './schema/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Types } from 'mongoose';
import { ProductService } from '../product/product.service';
import { productDocument } from '../product/schema/product.model';
import { OrderCalculation } from './dto/order';
import { CartRepo } from '../cart/cart.repo';
import { CreateCartProductItem } from '../cart/dto/create-cart.dto';
import { Ipaginate } from 'src/utils/base.repo';

@Injectable()
export class OrdersService {
  constructor(
    private orderRepo: OrderRepo,
    private productService: ProductService,
    private cartRepo: CartRepo,
  ) {}
  // TODO:Refactor 'too many await'
  async createOrder(
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
}
