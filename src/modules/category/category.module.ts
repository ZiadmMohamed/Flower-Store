import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { categoryModel } from './schema/category.model';
import { CategoryRepo } from './category.repo';
import { TokenService } from '../../common/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepo } from '../users/user.repo';
import { UserModel } from '../users/schema/user.schema';

@Module({
  imports: [categoryModel, UserModel],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryRepo,
    TokenService,
    JwtService,
    UserRepo,
  ],
})
export class CategoryModule {}
