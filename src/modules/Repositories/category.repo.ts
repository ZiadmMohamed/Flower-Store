import { Injectable } from '@nestjs/common';
import { BaseRepo } from './base.repo';
import { Category, categoryDocument } from '../category/schema/category.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoryRepo extends BaseRepo<categoryDocument> {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<categoryDocument>,
  ) {
    super(categoryModel);
  }

  async findCategoryById(id): Promise<categoryDocument> {
    return await this.categoryModel.findById(id);
  }
}
