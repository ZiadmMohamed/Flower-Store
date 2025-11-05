import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { GenderType, UserRoles } from 'src/modules/users/schema/user.types';

export class SignUpDTO {
  @ApiProperty({ type: String })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @ApiProperty({ type: String })
  @IsString({ message: 'User name must be a string' })
  @IsNotEmpty({ message: 'User name is required' })
  @MinLength(3, { message: 'User name must be at least 3 characters long' })
  userName: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  password: string;

  @ApiProperty({ enum: UserRoles })
  @IsEnum(UserRoles)
  role: string;

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

export class LoginDTO {
  @ApiProperty({ type: String })
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  password: string;
}

export class VerifyAccountDTO {
  @ApiProperty({ type: String })
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'OTP is required' })
  otp: string;
}
