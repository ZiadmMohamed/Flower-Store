import { PartialType } from '@nestjs/mapped-types';
import { CreatProductDTO } from './create.product.dto';
import { Types } from 'mongoose';
import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

<<<<<<< HEAD
export class updateProductDTO extends PartialType(CreatProductDTO) {
  @ApiProperty({
    description: 'The unique MongoDB ObjectId of the category.',
    example: '60c72b1f9e2b1c001f3f4c5e',
    type: String,
    required: true,
  })
=======
export class UpdateProductDTO extends PartialType(CreatProductDTO) {
>>>>>>> c628750aed0141e31dd992d0cad5a5924d5efbc2
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
