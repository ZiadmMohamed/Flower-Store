import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatProductDTO } from './DTO/create.product.dto';
import { CloudService } from 'src/common/multer/cloud.service';
import { ProductRepo } from 'src/modules/product/product.repo';
import { ProductIdDTO, UpdateProductDTO } from './DTO/update.product.DTO';
import { Iimage } from './DTO/product.interface';
import { CategoryRepo } from '../category/category.repo';
import { GetAllProductDTO } from './DTO/GetAllProductDTO.product.DTO';
import { FilterQuery } from 'mongoose';
import { productDocument } from './schema/product.model';
import { CreateOrderProductItem } from '../orders/dto/create-order.dto';

@Injectable()
export class ProductService {
  constructor(
    private cloudservice: CloudService,
    private ProductRepo: ProductRepo,
    private categoryRepo: CategoryRepo,
  ) {}
  async createProduct(body: CreatProductDTO, file?: Express.Multer.File) {
    const { originalPrice, discountAmount, categoryId } = body;

    const categoryExist = await this.categoryRepo.findCategoryById(categoryId);
    if (!categoryExist) {
      throw new BadRequestException('category is not exist');
    }

    if (file) {
      const folderId = String(Math.random() * (999999 - 100000 + 1) + 1);
      await this.cloudservice.uploadFile(file, {
        folder: `${process.env.app_name}/${categoryId}/product/${folderId}`,
      });
    }

    let finalPrice: number;
    if (discountAmount) {
      finalPrice =
        Number(originalPrice) -
        (Number(originalPrice) * Number(discountAmount)) / 100;
    }

    const product = await this.ProductRepo.create({
      ...body,
      finalPrice,
      categoryId,
    });
    return product;
  }

  async updateProduct(
    param: ProductIdDTO,
    body: UpdateProductDTO,
    file?: Express.Multer.File,
  ) {
    const { productId } = param;
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

    if (!product) throw new NotFoundException('product is not exist');

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

  async getAllORfilterproduct(query?: GetAllProductDTO) {
    const { name, minLength, maxLength, category, page } = query;

    const filters: FilterQuery<productDocument> = {};
    if (name) {
      filters.productName = { $regex: `${name}`, $options: 'i' };
    }

    if (minLength || maxLength) {
      filters.finalPrice = { $gte: minLength || 0, $lte: maxLength };
    }
    let categorydoc;
    if (category) {
      categorydoc = await this.categoryRepo.findOne({
        filters: { categoryName: { $regex: `${category}`, $options: 'i' } },
      });

      if (!categorydoc)
        throw new NotFoundException(`category name ${category} not found`);
      filters.categoryId = categorydoc.id;
      console.log(categorydoc, 'mpp');
    }

    return await this.ProductRepo.find({
      filters,
      page,
      populate: [{ path: 'category', select: 'categoryName' }],
    });
  }

  async decreaseProductsStock(
    updates: CreateOrderProductItem[],
  ): Promise<void> {
    await this.ProductRepo.decreaseProductsStock(updates);
  }

  async validateProductsStock(
    products: CreateOrderProductItem[],
  ): Promise<productDocument[]> {
    const stockChecks = products.map(async product => {
      const inStock = await this.ProductRepo.isProductInStock(product);
      if (!inStock) {
        throw new BadRequestException(
          `Product ${product.productId} is not in stock or has insufficient quantity`,
        );
      }

      return inStock;
    });

    return Promise.all(stockChecks);
  }
}
