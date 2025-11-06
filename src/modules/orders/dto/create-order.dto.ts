import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export enum PAYMENT_METHODS {
  CREDIT_CARD = 'credit_card',
  CASH = 'cash',
}

export class CreateOrderProductItem {
  @ApiProperty({ type: String })
  @IsMongoId()
  @IsNotEmpty()
  // @ProductExists()
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
  // TODO: add promo code validation
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  promoCode?: string;

  @ApiProperty({ type: [CreateOrderProductItem] })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductItem)
  products: CreateOrderProductItem[];
}
