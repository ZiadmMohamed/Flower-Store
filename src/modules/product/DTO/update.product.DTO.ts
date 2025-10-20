import { PartialType } from '@nestjs/mapped-types';
import { CreatProductDTO } from './create.product.dto';
import { Types } from 'mongoose';
import { IsMongoId } from 'class-validator';

export class updateProductDTO extends PartialType(CreatProductDTO) {
  @IsMongoId()
  categoryId: Types.ObjectId;
}
export class ProductIdDTO {
  @IsMongoId()
  productId: Types.ObjectId;
}
