import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { PaginationQueryParams } from 'src/common/dtos/pagination.query-params.dto';

export class GetAllProductDTO extends PaginationQueryParams {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  category?: string;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  maxLength?: number;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  minLength?: number;
}
