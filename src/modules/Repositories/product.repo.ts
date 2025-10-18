import { Injectable } from '@nestjs/common';
import {
  Product,
  productDocument,
} from './../../modules/product/schema/product.model';
import { BaseRepo } from './base.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class ProductRepo extends BaseRepo<productDocument> {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<productDocument>,
  ) {
    super(ProductModel);
  }
}
