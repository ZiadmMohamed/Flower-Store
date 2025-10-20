import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepo } from '../Repositories/category.repo';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { TokenService } from 'src/common/services/token.service';
import { UserRepo } from '../Repositories/user.repo';

describe('CategoryController', () => {
  let controller: CategoryController;
  const mockCategoryRepo = {
    findCategoryById: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
    // ... mock all other methods used by CategoryService
  };
  const mockTokenService = {
    generateToken: jest.fn(),
    verifyToken: jest.fn(),
  };
  const mockUserRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        CategoryService,
        { provide: CategoryRepo, useValue: mockCategoryRepo },
        { provide: TokenService, useValue: mockTokenService },
        { provide: UserRepo, useValue: mockUserRepo },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
