import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryParams {
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number;
}
