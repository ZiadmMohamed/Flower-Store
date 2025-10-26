import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsString, MinLength } from 'class-validator';
import { GenderType } from '../schema/user.types';

export class UpdateUserDTO {
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @IsString({ message: 'User name must be a string' })
  @MinLength(3, { message: 'User name must be at least 3 characters long' })
  userName: string;

  @IsEnum(GenderType)
  gender?: string;

  @IsString()
  phoneNumber?: string;

  @IsDate()
  @Type(() => Date)
  DOB?: Date;
}
