import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export enum PAYMENT_METHODS {
  CREDIT_CARD = 'credit_card',
  CASH = 'cash',
}

class CreateOrderProductItem {
  @ApiProperty({ type: String })
  @IsMongoId()
  @IsNotEmpty()
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
  products: CreateOrderProductItem[];
}
