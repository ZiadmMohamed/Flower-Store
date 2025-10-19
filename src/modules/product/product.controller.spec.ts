import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
// Define a mock for the service itself
const mockProductService = {
  createProduct: jest.fn(),
  // Add any other methods ProductController calls on ProductService
};

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { 
          provide: ProductService, 
          useValue: mockProductService, // Mock the entire service
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  // ... rest of your tests
});