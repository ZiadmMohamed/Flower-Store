import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { UserRepo } from '../users/user.repo';
import { TokenService } from 'src/common/services/token.service';

const mockProductService = {
  createProduct: jest.fn(),
};
const mockUserRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  updateOne: jest.fn(),
};
const mockTokenService = {
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
};
describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
        { provide: TokenService, useValue: mockTokenService },

        { provide: UserRepo, useValue: mockUserRepo },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
