import { Injectable } from '@nestjs/common';
import { OrderRepo } from './orders.repo';
import { OrderType } from './schema/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Types } from 'mongoose';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrdersService {
  constructor(
    private orderRepo: OrderRepo,
    private productService: ProductService,
  ) {}

  async createOrder(
    createOrderDTO: CreateOrderDto,
    userId: Types.ObjectId,
  ): Promise<OrderType> {
    await this.productService.validateProductsStock(createOrderDTO.products);
    await this.productService.decreaseProductsStock(createOrderDTO.products);

    const order = await this.orderRepo.create({ ...createOrderDTO, userId });
    return await this.orderRepo.save(order);
  }
}
