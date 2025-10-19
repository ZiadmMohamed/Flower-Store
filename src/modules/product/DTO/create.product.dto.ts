import { Types } from 'mongoose';
import { Iimage, productCategory, productStatus } from '../product.interface';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
  minLength,
  validate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatProductDTO {
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  productName: string;
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  stock: number;
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  originalPrice: number;

  @IsNumber()
  @Type(() => Number)
  discountAmount: number;
  @IsString()
  status?: productStatus;
  @IsString()
  category?: productCategory;
}
