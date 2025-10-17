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
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @IsString({ message: 'User name must be a string' })
  @IsNotEmpty({ message: 'User name is required' })
  @MinLength(3, { message: 'User name must be at least 3 characters long' })
  userName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(UserRoles)
  role: string;

  @IsEnum(GenderType)
  gender?: string;

  @IsString()
  phoneNumber?: string;

  @IsDate()
  @Type(() => Date)
  DOB?: Date;
}

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  password: string;
}
