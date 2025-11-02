import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UserDocument } from '../users/schema/user.schema';
import { categoryDocument } from './schema/category.model';
import {
  CategoryIdDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from './DTO/category.DTO';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('category')
@ApiTags('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  @ApiResponse({ status: 201, description: 'category created successfully' })
  @ApiOperation({ summary: 'Creates a new category .' })
  @ApiBody({ type: CreateCategoryDTO })
  async createCategory(
    @GetUser() user: UserDocument,
    @Body() body: CreateCategoryDTO,
  ): Promise<{ success: boolean; message: string; data: categoryDocument }> {
    const category = await this.categoryService.createCategory(user, body);
    return {
      success: true,
      message: 'category created successfully',
      data: category,
    };
  }
  @Post(':categoryId')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  @ApiResponse({ status: 201, description: 'category update successfully' })
  @ApiOperation({ summary: 'update  category .' })
  @ApiBody({ type: UpdateCategoryDTO })
  async updateCategory(
    @GetUser() user: UserDocument,
    @Body() body: UpdateCategoryDTO,
    @Param() param: CategoryIdDTO,
  ): Promise<{
    success: boolean;
    message: string;
    data: categoryDocument | null;
  }> {
    const updatedcategory = await this.categoryService.updateCategory(
      user,
      body,
      param,
    );
    return {
      success: true,
      message: 'category updated successfully',
      data: updatedcategory,
    };
  }

  @Delete(':categoryId')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  @ApiResponse({ status: 201, description: 'category delete successfully' })
  @ApiOperation({ summary: 'delete  category .' })
  async deleteCategory(
    @GetUser() user: UserDocument,
    @Param() param: CategoryIdDTO,
  ): Promise<{ success: boolean; message: string }> {
    await this.categoryService.deleteCategory(user, param);
    return { success: true, message: 'category delete successfully' };
  }

  @Get(':categoryId')
  // @UseGuards(AuthGuard)
  // @Roles(['admin', 'user'])
  @ApiResponse({ status: 201, description: 'get category' })
  @ApiOperation({ summary: 'get  category .' })
  async getCategory(
    @GetUser() user: UserDocument,
    @Param() param: CategoryIdDTO,
  ): Promise<{
    success: boolean;
    message: string;
    data: categoryDocument | null;
  }> {
    const getCategory = await this.categoryService.getCategory(user, param);
    return {
      success: true,
      message: ' get  category successfully',
      data: getCategory,
    };
  }

  @Get('')
  // @UseGuards(AuthGuard)
  // @Roles(['admin', 'user'])
  @ApiResponse({ status: 201, description: 'get all category' })
  @ApiOperation({ summary: 'get all category .' })
  async getAllCategory(): Promise<{
    success: boolean;
    message: string;
    data: categoryDocument[];
  }> {
    const getAllCategory = await this.categoryService.getAllCategory();
    return {
      success: true,
      message: ' get all  category successfully',
      data: getAllCategory as categoryDocument[],
    };
  }
}
