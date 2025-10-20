import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CloudService } from 'src/common/multer/cloud.service';
import { ProductRepo } from 'src/modules/Repositories/product.repo';
import { productModel } from './schema/product.model';
import { TokenService } from 'src/common/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepo } from '../Repositories/user.repo';
import { UserModel } from '../users/schema/user.schema';
import { CategoryRepo } from '../Repositories/category.repo';
import { categoryModel } from '../category/schema/category.model';

@Module({
  imports: [productModel,UserModel,categoryModel],
  controllers: [ProductController],
  providers: [ProductService, CloudService, ProductRepo,TokenService,JwtService,UserRepo,CategoryRepo],
})
export class ProductModule {}
