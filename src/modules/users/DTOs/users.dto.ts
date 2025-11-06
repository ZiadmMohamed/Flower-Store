import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsString, MinLength } from 'class-validator';
import { GenderType } from '../schema/user.types';

export class UpdateUserDTO {
  @ApiProperty({ type: String })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @ApiProperty({ type: String })
  @IsString({ message: 'User name must be a string' })
  @MinLength(3, { message: 'User name must be at least 3 characters long' })
  userName: string;

  @ApiProperty({ enum: GenderType, required: false })
  @IsEnum(GenderType)
  gender?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ type: Date, required: false })
  @IsDate()
  @Type(() => Date)
  DOB?: Date;
}
