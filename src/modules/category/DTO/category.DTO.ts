import { Types } from 'mongoose';
import { IsMongoId, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateCategoryDTO {
  @ApiProperty({
    description: 'The new unique name for the category.',
    example: 'Luxury Bouquets',
    minLength: 4,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  categoryName: string;
}
export class UpdateCategoryDTO {
  @ApiProperty({
    description: 'The new unique name for the category.',
    example: 'Luxury Bouquets',
    minLength: 4,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  categoryName: string;
}
export class CategoryIdDTO {
  @ApiProperty({
    description: 'The unique MongoDB ID (ObjectId) of the category.',
    example: '60c72b1f9e2b1c001f3f4c5e',
    required: true,
  })
  @IsMongoId()
  categoryId: Types.ObjectId;
}
