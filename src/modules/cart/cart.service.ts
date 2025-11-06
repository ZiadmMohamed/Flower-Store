import { Injectable } from '@nestjs/common';
import { CartRepo } from './cart.repo';
import { CreateCartDto } from './dto/create-cart.dto';
import { ProductService } from '../product/product.service';
import { Types, UpdateResult } from 'mongoose';
import { Cart } from './schema/cart.schema';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepo: CartRepo,
    private readonly productService: ProductService,
  ) {}

  async createCart(
    createCartDto: CreateCartDto,
    userId: Types.ObjectId,
  ): Promise<UpdateResult> {
    const cart = await this.cartRepo.findOne({ filters: { userId } });

    if (cart && cart.products.length > 0)
      this.updateCartProducts(cart, createCartDto);

    return this.cartRepo.upsertCart(createCartDto, userId);
  }

  private updateCartProducts(
    cart: Cart,
    createCartDto: CreateCartDto,
  ): CreateCartDto {
    const existingProducts = cart.products;

    const existingMap = new Map(
      existingProducts.map(p => [p.productId, p.quantity]),
    );

    const updatedProducts = createCartDto.products.map(newProduct => {
      const existingQty = existingMap.get(newProduct.productId) || 0;
      return {
        ...newProduct,
        quantity: newProduct.quantity + existingQty,
      };
    });

    if (updatedProducts.length === 0) return createCartDto;

    for (const oldProduct of existingProducts) {
      const existsInNew = createCartDto.products.some(
        p => p.productId === oldProduct.productId,
      );
      if (!existsInNew) {
        updatedProducts.push(oldProduct);
      }
    }

    return {
      ...createCartDto,
      products: updatedProducts,
    };
  }
}
