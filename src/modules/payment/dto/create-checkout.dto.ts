import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckoutDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  amount: number;

  @ApiProperty({ type: String })
  @IsString()
  currency: string;

  @ApiProperty({ type: String })
  @IsString()
  productName: string;
}
