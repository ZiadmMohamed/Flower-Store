import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { CategoryRepo } from './category.repo';
import { AuthGuard } from 'src/common/guards/auth.guard';

describe('CategoryService', () => {
  let service: CategoryService;

  const mockCategoryRepo = {
    findCategoryById: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
    // ... mock all other methods used by CategoryService
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepo, // <-- The dependency class
          useValue: mockCategoryRepo, // <-- The mock object
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();
    service = module.get<CategoryService>(CategoryService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
