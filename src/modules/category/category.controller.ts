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
import { AuthGuard } from '../../common/guards/auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserDocument } from '../users/schema/user.schema';
import { categoryDocument } from './schema/category.model';
import {
  CategoryIdDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from './DTO/create.category.DTO';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('category')
@ApiTags('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  @ApiBody({ type: CreateCategoryDTO })
  @ApiBearerAuth()
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
  async deleteCategory(
    @GetUser() user: UserDocument,
    @Param() param: CategoryIdDTO,
  ): Promise<{ success: boolean; message: string }> {
    await this.categoryService.deleteCategory(user, param);
    return { success: true, message: 'category delete successfully' };
  }

  @Get(':categoryId')
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
