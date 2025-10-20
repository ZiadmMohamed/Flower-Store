import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepo } from '../Repositories/category.repo';

describe('CategoryController', () => {
  let controller: CategoryController;
const mockCategoryRepo = {
  findCategoryById: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  updateOne: jest.fn(),
  // ... mock all other methods used by CategoryService
};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [CategoryService,{provide:CategoryRepo,useValue:mockCategoryRepo}],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
