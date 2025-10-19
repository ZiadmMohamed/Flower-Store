import { ProductRepo } from './../../common/Repositories/product.repo';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatProductDTO } from './DTO/create.product.dto';
import { CloudService } from 'src/common/multer/cloud.service';

@Injectable()
export class ProductService {
  constructor(
    private cloudservice: CloudService,
    private ProductRepo: ProductRepo,
  ) {}
  async createProduct(body: CreatProductDTO, file: Express.Multer.File) {
    const {
      productName,
      description,
      stock,
      originalPrice,
      discountAmount,
      category,
    } = body;

    if (!file) {
      throw new BadRequestException('product image is require');
    }
    const folderId = String(Math.random() * (999999 - 100000 + 1) + 1);
    const image = await this.cloudservice.uploadFile(file, {
      folder: `${process.env.app_name}/product/${category}/${folderId}`,
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
    });
    return product;
  }
}
