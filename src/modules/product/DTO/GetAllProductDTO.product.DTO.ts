import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { PaginationQueryParams } from 'src/common/dtos/pagination.query-params.dto';

export class GetAllProductDTO extends PaginationQueryParams {
  @ApiPropertyOptional({
    description:
      'Search term for filtering products by name (case-insensitive).',
    example: 'rose',
    type: String,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter products by category name (e.g., "Seasonal Flowers").',
    example: 'luxury',
    type: String,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'The maximum final price limit for filtering.',
    example: 200,
    minimum: 1,
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  maxLength?: number;

  @ApiPropertyOptional({
    description: 'The minimum final price limit for filtering.',
    example: 50,
    minimum: 1,
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  minLength?: number;
}
