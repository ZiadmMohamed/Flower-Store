import { productStatus } from './product.interface';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatProductDTO {
  @ApiProperty({
    description: 'The unique name of the product.',
    example: 'Premium Tulip Bouquet',
    minLength: 4,
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  productName: string;

  @ApiProperty({
    description: 'Detailed description of the product.',
    example: 'A hand-tied bouquet of 25 vibrant red tulips.',
    minLength: 4,
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The available inventory count for the product.',
    example: 50,
    minimum: 1,
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  stock: number;

  @ApiProperty({
    description: 'The base price before any discounts.',
    example: 120.0,

    type: Number,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  originalPrice: number;

  @ApiPropertyOptional({
    description:
      'The discount amount to be subtracted from the original price.',
    example: 20,
    default: 0,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  discountAmount: number;

  @ApiPropertyOptional({
    description: 'The current sales status of the product.',
    example: productStatus.INSTOCK,
    enum: productStatus,
  })
  @IsOptional()
  @IsString()
  status?: productStatus;

  @ApiProperty({
    description: 'The MongoDB ObjectId of the associated category.',
    example: '60c72b1f9e2b1c001f3f4c5e',
    type: String,
  })
  @IsMongoId()
  categoryId: Types.ObjectId;
}
