import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatProductDTO } from './DTO/create.product.dto';
import { CloudService } from 'src/common/multer/cloud.service';
import { ProductRepo } from 'src/modules/Repositories/product.repo';
import { UserDocument } from '../users/schema/user.schema';
import { ProductIdDTO, updateProductDTO } from './DTO/update.product.DTO';
import { Iimage } from './product.interface';
import { CategoryRepo } from '../Repositories/category.repo';

@Injectable()
export class ProductService {
  constructor(
    private cloudservice: CloudService,
    private ProductRepo: ProductRepo,
    private categoryRepo: CategoryRepo,
  ) {}
  async createProduct(body: CreatProductDTO, file: Express.Multer.File) {
    const { originalPrice, discountAmount, categoryId } = body;
    const categoryExist = await this.categoryRepo.findCategoryById(categoryId);
    if (!categoryExist) {
      throw new BadRequestException('category is not exist');
    }
    if (!file) {
      throw new BadRequestException('product image is require');
    }
    const folderId = String(Math.random() * (999999 - 100000 + 1) + 1);
    const image = await this.cloudservice.uploadFile(file, {
      folder: `${process.env.app_name}/${categoryId}/product/${folderId}`,
    });
    let finalPrice: number;
    if (discountAmount) {
      finalPrice =
        Number(originalPrice) -
        (Number(originalPrice) * Number(discountAmount)) / 100;
    }
    console.log('final', finalPrice);

    const product = await this.ProductRepo.create({
      ...body,
      image,
      finalPrice,
      folderId,
      categoryId,
    });
    return product;
  }

  async updateProduct(
    param: ProductIdDTO,
    user: UserDocument,
    body: updateProductDTO,
    file?: Express.Multer.File,
  ) {
    const { productId } = param;
    const categoryExist = await this.categoryRepo.findCategoryById(
      body.categoryId,
    );
    if (!categoryExist) {
      throw new BadRequestException('category is not exist');
    }

    const product = await this.ProductRepo.findProductById(productId);
    if (!product) {
      throw new NotFoundException('product is not exist');
    }
    let image: Iimage;
    if (file) {
      await this.cloudservice.destroyFile(product.image.public_id);
      image = await this.cloudservice.uploadFile(file, {
        folder: `${process.env.app_name}/product/${product.categoryId}/${product.folderId}`,
      });
    }
    let finalPrice: number;
    if (body.discountAmount || body.originalPrice) {
      finalPrice =
        Number(body.originalPrice || product.originalPrice) -
        (Number(body.originalPrice || product.originalPrice) *
          Number(body.discountAmount || product.discountAmount)) /
          100;
    }
    const updatedProduct = await this.ProductRepo.updateOne(
      { _id: productId },
      { ...body, finalPrice, image },
    );
    return updatedProduct;
  }
  async getProduct(param: ProductIdDTO) {
    const { productId } = param;
    const product = await this.ProductRepo.findProductById(productId);
    if (!product) {
      throw new NotFoundException('product is not exist');
    }
    return await this.ProductRepo.findOne({ filters: { _id: productId } });
  }
  async DeleteProduct(param: ProductIdDTO) {
    const { productId } = param;
    const product = await this.ProductRepo.findProductById(productId);
    if (!product) {
      throw new NotFoundException('product is not exist');
    }
    return await this.ProductRepo.deleteOne(productId);
  }
}
