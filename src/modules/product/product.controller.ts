import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UserDocument } from '../users/schema/user.schema';
import { ProductIdDTO, updateProductDTO } from './DTO/update.product.DTO';
import { productDocument } from './schema/product.model';
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
  async createProduct(
    @Body() body: CreatProductDTO,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: UserDocument,
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
  @ApiBody({ type: updateProductDTO })
  @UseInterceptors(
    FileInterceptor('file', MulterOption({ validation: filevalidation.image })),
  )
  async updateProduct(
    @Param() param: ProductIdDTO,
    @GetUser() user: UserDocument,
    @Body() body: updateProductDTO,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<{
    success: boolean;
    message: string;
    data: productDocument | null;
  }> {
    const updatedProduct = await this.productService.updateProduct(
      param,
      user,
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
   @UseGuards(AuthGuard)
  @Roles(['admin',"user"])
  @ApiOperation({ summary: 'get product .' })
  @ApiResponse({ status: 201, description: 'get  Product successfully .' })
  async getProduct(@Param() param:ProductIdDTO):Promise<{success:boolean,message:string,data:productDocument}>{
    const product=await this.productService.getProduct(param)
    return{success:true,message:"get  Product successfully ",data:product}

  }
    @Delete(':productId')
   @UseGuards(AuthGuard)
  @Roles(['admin',"user"])
  @ApiOperation({ summary: 'delete product .' })
  @ApiResponse({ status: 201, description: 'delete  Product successfully .' })
  async DeleteProduct(@Param() param:ProductIdDTO):Promise<{success:boolean,message:string}>{
    const product=await this.productService.DeleteProduct(param)
    return{success:true,message:"delete  Product successfully "}

  }
}
