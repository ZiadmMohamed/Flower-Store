import { Types } from 'mongoose';

export interface OrderCalculation {
  products: Array<{
    productId: Types.ObjectId;
    quantity: number;
    priceAtPurchase: number;
    subtotal: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
}
