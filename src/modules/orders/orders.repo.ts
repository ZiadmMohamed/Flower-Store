import { Injectable } from '@nestjs/common';
import { BaseRepo } from '../../utils/base.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderType } from './schema/order.schema';

@Injectable()
export class OrderRepo extends BaseRepo<OrderType> {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderType>,
  ) {
    super(orderModel);
  }
}
