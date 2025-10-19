import { Types } from 'mongoose';
export interface Iimage {
  secure_url: string;
  public_id: string;
}
export enum productStatus {
  INSTOCK = 'instock',
  OUTSTOCK = 'outstock',
}
// flowers, bouquets, gifts, accessories).
export enum productCategory {
  FLOWERS = 'flowers',
  BOUTUETS = 'boutuets',
  GIFTS = 'gifts',
  ACCESSORIES = 'accessories',
}
export interface Iproduct {
  productName: string;
  description: string;
  createdBy: Types.ObjectId;
  stock: number;
  originalPrice: number;
  discountAmount: number;

  finalPrice: number;
  image: Iimage;
  status: productStatus;
  category: productCategory;
}
