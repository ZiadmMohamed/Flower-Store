import { Types } from 'mongoose';
import { IsMongoId, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateCategoryDTO{
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    categoryName:string

}
export class UpdateCategoryDTO{
      @IsString()
    @IsNotEmpty()
    @MinLength(4)
    categoryName:string

}
export class CategoryIdDTO{
    @IsMongoId()
    categoryId:Types.ObjectId 
}