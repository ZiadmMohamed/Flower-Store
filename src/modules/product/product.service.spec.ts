import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { CloudService } from 'src/common/multer/cloud.service';
import { ProductRepo } from '../Repositories/product.repo';
import { CategoryRepo } from '../Repositories/category.repo';

const mockCloudService = {
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
};

const mockProductRepo = {
  create: jest.fn(),
  findOne: jest.fn(),
};
const mockCategoryRepo = {
  create: jest.fn(),
  findOne: jest.fn(),
};
describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: CloudService,
          useValue: mockCloudService,
        },
        {
          provide: ProductRepo,
          useValue: mockProductRepo,
        },
        { provide: CategoryRepo, useValue: mockCategoryRepo },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
