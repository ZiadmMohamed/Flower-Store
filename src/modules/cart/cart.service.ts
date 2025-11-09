import { BadRequestException, Injectable } from '@nestjs/common';
import { CartRepo } from './cart.repo';
import { CreateCartDto, CreateCartProductItem } from './dto/create-cart.dto';
import { Types, UpdateResult } from 'mongoose';

@Injectable()
export class CartService {
  constructor(private readonly cartRepo: CartRepo) {}

  async createCart(
    createCartDto: CreateCartDto,
    userId: Types.ObjectId,
  ): Promise<UpdateResult> {
    const cart = await this.cartRepo.findOne({ filters: { userId } });

    if (cart && cart.products.length > 0)
      createCartDto.products = this.updateCartProducts(
        cart.products,
        createCartDto.products,
      );

    return this.cartRepo.upsertCart(createCartDto, userId);
  }

  private updateCartProducts(
    existingProducts: CreateCartProductItem[],
    newProducts: CreateCartProductItem[],
  ): CreateCartProductItem[] {
    const newProductsIds = newProducts.map(p => p.productId);
    const newProductsIdsUnique = new Set(newProductsIds);

    if (newProductsIdsUnique.size !== newProducts.length)
      throw new BadRequestException('Duplicate product IDs found');

    const existingMap = new Map(
      existingProducts.map(p => [p.productId, p.quantity]),
    );

    return newProducts.map(newProduct => ({
      ...newProduct,
      quantity:
        newProduct.quantity + (existingMap.get(newProduct.productId) || 0),
    }));
  }
}
