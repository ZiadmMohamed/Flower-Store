import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ProductExists } from 'src/common/validators/product-exists.validator';

export enum PAYMENT_METHODS {
  CREDIT_CARD = 'credit_card',
  CASH = 'cash',
}

class CreateOrderProductItem {
  @ApiProperty({ type: String })
  @IsMongoId()
  @IsNotEmpty()
  @ProductExists({ message: 'Product does not exist' })
  productId: Types.ObjectId;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ enum: PAYMENT_METHODS })
  @IsEnum(PAYMENT_METHODS)
  @IsNotEmpty()
  paymentMethod: PAYMENT_METHODS;

  @ApiProperty({ type: [CreateOrderProductItem] })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductItem)
  products: CreateOrderProductItem[];
}
