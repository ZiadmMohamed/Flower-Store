import { CategoryRepo } from './../Repositories/category.repo';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserDocument } from '../users/schema/user.schema';
import { CategoryIdDTO, CreateCategoryDTO, UpdateCategoryDTO } from './DTO/create.category.DTO';
import { Types } from 'mongoose';

@Injectable()
export class CategoryService {
constructor(private categoryRepo:CategoryRepo){}

    async createCategory(user:UserDocument,body:CreateCategoryDTO){
        const categoryExist=await this.categoryRepo.findOne({filters:{categoryName:body.categoryName}})
        if (categoryExist) {
            throw new ConflictException("the category name is already exist ")
            
        }
        console.log("user",user);
        
        const category=await this.categoryRepo.create({...body,createdBy:user._id as Types.ObjectId})
        return category
    }
    async updateCategory(user:UserDocument,body:UpdateCategoryDTO,param:CategoryIdDTO){
        const{categoryId}=param
        const categoryExist=await this.categoryRepo.findCategoryById(categoryId)
        if (!categoryExist) {
            throw new NotFoundException("category is not exist")
            
        }
        if (body.categoryName && await this.categoryRepo.findOne({filters:{categoryName:body.categoryName,_id:{$ne:categoryId}}})) {
            throw new ConflictException("an category have the same name")
        }
        const updatedCategory=await this.categoryRepo.updateOne({_id:categoryId},{...body,updateBy:user._id as Types.ObjectId})
    return updatedCategory
    }

    async deleteCategory(user:UserDocument,param:CategoryIdDTO){
    const{categoryId}=param
        const categoryExist=await this.categoryRepo.findCategoryById(categoryId)
        if (!categoryExist) {
            throw new NotFoundException("category is not exist")
            
        }
        return await this.categoryRepo.deleteOne(categoryId)
    }
    async getCategory(user:UserDocument,param:CategoryIdDTO){
   const{categoryId}=param
        const categoryExist=await this.categoryRepo.findCategoryById(categoryId)
        if (!categoryExist) {
            throw new NotFoundException("category is not exist")
            
        }
        return await this.categoryRepo.findOne({filters:{_id:categoryId}})
    }
    async getAllCategory(){
        return await this.categoryRepo.find({})

    }
}
