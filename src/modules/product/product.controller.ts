import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreatProductDTO } from './DTO/create.product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOption } from 'src/common/multer/multer.options';
import { filevalidation } from 'src/common/constants';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ProductIdDTO, UpdateProductDTO } from './DTO/update.product.DTO';
import { productDocument } from './schema/product.model';
import { GetAllProductDTO } from './DTO/GetAllProductDTO.product.DTO';
import { Ipaginate } from '../../utils/base.repo';
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
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  @ApiOperation({ summary: 'Creates a new product with an image.' })
  @ApiResponse({ status: 201, description: 'Product successfully created.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatProductDTO })
  @ApiBearerAuth()
  async createProduct(
    @Body() body: CreatProductDTO,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const product = await this.productService.createProduct(body, file);
    return { data: product, message: 'product created successfully' };
  }

  @Patch(':productId')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  @ApiOperation({ summary: 'update a new product with an image.' })
  @ApiResponse({ status: 201, description: 'Product successfully updated.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProductDTO })
  @UseInterceptors(
    FileInterceptor('file', MulterOption({ validation: filevalidation.image })),
  )
  async updateProduct(
    @Param() param: ProductIdDTO,
    @Body() body: UpdateProductDTO,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<{
    success: boolean;
    message: string;
    data: productDocument | null;
  }> {
    const updatedProduct = await this.productService.updateProduct(
      param,
      body,
      file,
    );
    return {
      success: true,
      message: 'product updated successfully',
      data: updatedProduct,
    };
  }

  @Get(':productId')
  async getProduct(
    @Param() param: ProductIdDTO,
  ): Promise<{ success: boolean; message: string; data: productDocument }> {
    const product = await this.productService.getProduct(param);
    return {
      success: true,
      message: 'get  Product successfully ',
      data: product,
    };
  }

  @Delete(':productId')
  @UseGuards(AuthGuard)
  @Roles(['admin', 'user'])
  @ApiOperation({ summary: 'delete product .' })
  @ApiResponse({ status: 201, description: 'delete  Product successfully .' })
  async DeleteProduct(
    @Param() param: ProductIdDTO,
  ): Promise<{ success: boolean; message: string }> {
    await this.productService.DeleteProduct(param);
    return { success: true, message: 'delete  Product successfully ' };
  }

  @Get()
  async getAllORfilterproduct(@Query() query: GetAllProductDTO): Promise<{
    success: boolean;
    message: string;
    data: productDocument[] | Ipaginate<productDocument> | [];
  }> {
    const AllProduct = await this.productService.getAllORfilterproduct(query);
    return {
      success: true,
      message: 'get All Product successfully',
      data: AllProduct,
    };
  }
}
