import { Injectable } from '@nestjs/common';
import { Product, productDocument } from './schema/product.model';
import { BaseRepo } from '../../utils/base.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderProductItem } from '../orders/dto/create-order.dto';
@Injectable()
export class ProductRepo extends BaseRepo<productDocument> {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<productDocument>,
  ) {
    super(ProductModel);
  }

  async findProductById(id): Promise<productDocument> {
    return this.ProductModel.findById(id);
  }

  async decreaseProductsStock(
    updates: CreateOrderProductItem[],
  ): Promise<number> {
    if (!updates.length) return 0;

    const bulkOps = updates.map(({ productId, quantity }) => ({
      updateOne: {
        filter: { _id: productId, stock: { $gte: quantity } },
        update: { $inc: { stock: -Math.abs(quantity) } },
      },
    }));

    const result = await this.ProductModel.bulkWrite(bulkOps, {
      ordered: false,
    });

    return result.modifiedCount ?? 0;
  }

  async isProductInStock(
    product: CreateOrderProductItem,
  ): Promise<productDocument> {
    const result = await this.ProductModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
    });

    return result;
  }
}
