import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreatProductDTO } from './DTO/create.product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOption } from 'src/common/multer/multer.options';
import { filevalidation } from 'src/common/constants';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Products')

@Controller('product')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    stopAtFirstError: false,
  }),
)
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @UseInterceptors(
    FileInterceptor('file', MulterOption({ validation: filevalidation.image })),
  )
  @Post('')
  async createProduct(
    @Body() body: CreatProductDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const product = await this.productService.createProduct(body, file);
    return { data: product, message: 'product created successfully' };
  }
}
