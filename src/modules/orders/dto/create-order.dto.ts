import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum PAYMENT_METHODS {
  CREDIT_CARD = 'credit_card',
  CASH = 'cash',
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
}
