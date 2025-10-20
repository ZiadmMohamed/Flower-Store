import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { CategoryRepo } from '../Repositories/category.repo';

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
    await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepo, // <-- The dependency class
          useValue: mockCategoryRepo, // <-- The mock object
        },
      ],
    }).compile();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
