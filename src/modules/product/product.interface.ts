import { Types } from 'mongoose';
export interface Iimage {
  secure_url: string;
  public_id: string;
}
export enum productStatus {
  INSTOCK = 'INSTOCK',
  OUTSTOCK = 'OUTSTOCK',
}
export interface Iproduct {
  productName: string;
  description: string;
  createdBy: Types.ObjectId;
  stock: number;
  originalPrice: number;
  finalPrice: number;
  image: Iimage;
  status: productStatus;
}
