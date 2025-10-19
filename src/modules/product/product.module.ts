import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CloudService } from 'src/common/multer/cloud.service';
import { ProductRepo } from 'src/common/Repositories/product.repo';
import { productModel } from './schema/product.model';

@Module({
  imports:[productModel],
  controllers: [ProductController],
  providers: [ProductService,CloudService,ProductRepo],
})
export class ProductModule {}
