import { User } from 'src/modules/users/schema/user.schema';
import { Injectable } from "@nestjs/common";
import { ICategory } from "../category.interface";
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from 'mongoose';

@Injectable()
@Schema({timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})
export class Category implements ICategory{
@Prop({required:true,unique:true})
       categoryName:string;
       @Prop({type:Types.ObjectId,ref:User.name})

        createdBy:Types.ObjectId;
               @Prop({type:Types.ObjectId,ref:User.name})

        updateBy:Types.ObjectId;

}
export const categorySchema=SchemaFactory.createForClass(Category)
export const categoryModel=MongooseModule.forFeature([{name:Category.name,schema:categorySchema}])
export type categoryDocument=HydratedDocument<Category>