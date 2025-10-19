import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';

// src/modules/product/product.service.spec.ts

// ... (Define mockCloudService and mockProductRepo here)
// Define Mocks outside the test suite
const mockCloudService = {
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
};

const mockProductRepo = {
  create: jest.fn(),
  findOne: jest.fn(),
  // Add any other methods ProductService calls on ProductRepo
};
describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService, // The service under test
        { 
          provide: CloudService, // Provide the actual class/token
          useValue: mockCloudService, // Use the mock object
        },
        { 
          provide: ProductRepo, 
          useValue: mockProductRepo,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  // ... rest of your tests
});
