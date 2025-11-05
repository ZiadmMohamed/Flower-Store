import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreatProductDTO } from './create.product.dto';
import { Types } from 'mongoose';
import { IsMongoId, IsOptional } from 'class-validator';

export class UpdateProductDTO extends PartialType(CreatProductDTO) {
  @ApiProperty({ type: String })
  @IsMongoId()
  @IsOptional()
  categoryId?: Types.ObjectId;
}
export class ProductIdDTO {
  @ApiProperty({ type: String })
  @IsMongoId()
  productId: Types.ObjectId;
}
