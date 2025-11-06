import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ProductExists } from 'src/common/validators/product-exists.validator';

export class CreateCartProductItem {
  @ApiProperty({ type: String })
  @IsMongoId()
  @IsNotEmpty()
  @ProductExists()
  productId: Types.ObjectId;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}

export class CreateCartDto {
  @ApiProperty({ type: [CreateCartProductItem] })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateCartProductItem)
  products: CreateCartProductItem[];
}
