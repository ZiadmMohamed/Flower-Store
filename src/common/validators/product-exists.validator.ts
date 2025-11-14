import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ProductRepo } from '../../modules/product/product.repo';
import { Types } from 'mongoose';
import { CreateCartProductItem } from 'src/modules/cart/dto/create-cart.dto';

@ValidatorConstraint({ name: 'ProductExists', async: true })
@Injectable()
export class ProductExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly productRepo: ProductRepo) {}
  // TODO: inject the product in the req body to avoid multiple database calls
  async validate(_: any, args: ValidationArguments): Promise<boolean> {
    const { productId, quantity } = args.object as CreateCartProductItem;

    if (!Types.ObjectId.isValid(productId)) return false;

    const product = await this.productRepo.findProductById(productId);
    if (!product) return false;

    if (quantity && product.stock < quantity) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const { productId, quantity } = args.object as CreateCartProductItem;
    if (!Types.ObjectId.isValid(productId)) {
      return `Invalid product ID`;
    }
    return `Product with id ${productId} not found or not enough stock for quantity ${quantity}`;
  }
}

export function ProductExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ProductExistsConstraint,
    });
  };
}
