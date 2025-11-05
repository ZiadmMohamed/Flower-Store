import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { IsMongoId, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCategoryDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  categoryName: string;
}
export class UpdateCategoryDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  categoryName: string;
}
export class CategoryIdDTO {
  @ApiProperty({ type: String })
  @IsMongoId()
  categoryId: Types.ObjectId;
}
