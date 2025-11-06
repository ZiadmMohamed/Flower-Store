import { ApiProperty } from '@nestjs/swagger';
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

export class CreatProductDTO {
  @ApiProperty({ type: String })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ type: String })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  stock: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  originalPrice: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  discountAmount: number;

  @ApiProperty({ enum: productStatus, required: false })
  @IsString()
  status?: productStatus;

  @ApiProperty({ type: String })
  @IsMongoId()
  categoryId: Types.ObjectId;
}
