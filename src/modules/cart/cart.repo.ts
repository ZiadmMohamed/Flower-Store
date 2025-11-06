import { Injectable } from '@nestjs/common';
import { BaseRepo } from '../../utils/base.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateResult } from 'mongoose';
import { Cart, CartType } from './schema/cart.schema';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartRepo extends BaseRepo<CartType> {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartType>,
  ) {
    super(cartModel);
  }

  async upsertCart(
    createCartDto: CreateCartDto,
    userId: Types.ObjectId,
  ): Promise<UpdateResult> {
    return this.cartModel
      .updateOne({ userId }, { $set: { ...createCartDto } }, { upsert: true })
      .lean();
  }
}
