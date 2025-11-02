import { PartialType } from '@nestjs/mapped-types';
import { CreatProductDTO } from './create.product.dto';
import { Types } from 'mongoose';
import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class updateProductDTO extends PartialType(CreatProductDTO) {
  @ApiProperty({
    description: 'The unique MongoDB ObjectId of the category.',
    example: '60c72b1f9e2b1c001f3f4c5e',
    type: String,
    required: true,
  })
  @IsMongoId()
  categoryId: Types.ObjectId;
}
export class ProductIdDTO {
  @ApiProperty({
    description: 'The unique MongoDB ObjectId of the category.',
    example: '60c72b1f9e2b1c001f3f4c5e',
    type: String,
    required: true,
  })
  @IsMongoId()
  productId: Types.ObjectId;
}
