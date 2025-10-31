import { Injectable } from '@nestjs/common';
import { OrderRepo } from './orders.repo';
import { OrderType } from './schema/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Types } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(private orderRepo: OrderRepo) {}

  async createOrder(
    createOrderDTO: CreateOrderDto,
    userId: Types.ObjectId,
  ): Promise<OrderType> {
    const order = await this.orderRepo.create({ ...createOrderDTO, userId });
    return await this.orderRepo.save(order);
  }
}
