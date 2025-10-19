import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';

const mockCloudService = {
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
};

const mockProductRepo = {
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
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
