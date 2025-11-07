import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CloudService } from '../../common/multer/cloud.service';
import { ProductRepo } from './product.repo';
import { productModel } from './schema/product.model';
import { TokenService } from '../../common/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepo } from '../users/user.repo';
import { UserModel } from '../users/schema/user.schema';
import { CategoryRepo } from '../category/category.repo';
import { categoryModel } from '../category/schema/category.model';

@Module({
  imports: [productModel, UserModel, categoryModel],
  controllers: [ProductController],
  providers: [
    ProductService,
    CloudService,
    ProductRepo,
    TokenService,
    JwtService,
    UserRepo,
    CategoryRepo,
  ],
  exports: [ProductRepo, ProductService],
})
export class ProductModule {}
