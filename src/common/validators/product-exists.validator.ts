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

@ValidatorConstraint({ name: 'ProductExists', async: true })
@Injectable()
export class ProductExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly productRepo: ProductRepo) {}

  async validate(productId: Types.ObjectId | string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(productId)) {
        return false;
      }
      const product = await this.productRepo.findProductById(productId);
      return !!product;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `Product with id ${args.value} does not exist`;
  }
}

export function ProductExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ProductExistsConstraint,
    });
  };
}
