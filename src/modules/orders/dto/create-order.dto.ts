import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

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

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({ type: [CreateOrderProductItem] })
  @IsArray()
  @IsNotEmpty()
  products: CreateOrderProductItem[];
}
