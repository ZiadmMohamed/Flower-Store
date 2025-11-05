import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { PaginationQueryParams } from 'src/common/dtos/pagination.query-params.dto';

export class GetAllProductDTO extends PaginationQueryParams {
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  maxLength?: number;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  minLength?: number;
}
