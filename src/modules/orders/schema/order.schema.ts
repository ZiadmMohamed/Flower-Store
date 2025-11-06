import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from '../../product/schema/product.model';
import { User } from '../../users/schema/user.schema';
import { PAYMENT_METHODS } from '../dto/create-order.dto';

export type OrderDocument = HydratedDocument<Order>;

export enum ORDER_STATUS {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PAYMENT_STATUS {
  UNPAID = 'unpaid',
  PAID = 'paid',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

class OrderProductItem {
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  productId: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1 })
  quantity: number;

  @Prop({ type: Number, required: true })
  priceAtPurchase: number;

  @Prop({ type: Number, required: true })
  subtotal: number;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: String, unique: true, required: true })
  orderNumber: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({
    type: String,
    enum: PAYMENT_METHODS,
    required: true,
    default: PAYMENT_METHODS.CASH,
  })
  paymentMethod: PAYMENT_METHODS;

  @Prop({
    type: String,
    enum: ORDER_STATUS,
    required: true,
    default: ORDER_STATUS.PENDING,
  })
  orderStatus: ORDER_STATUS;

  @Prop({
    type: String,
    enum: PAYMENT_STATUS,
    required: true,
    default: PAYMENT_STATUS.UNPAID,
  })
  paymentStatus: PAYMENT_STATUS;

  @Prop({ type: String, required: false })
  promoCode?: string;

  @Prop({ type: Number, required: false, default: 0 })
  discount: number;

  @Prop({ type: [OrderProductItem], required: true })
  products: OrderProductItem[];

  @Prop({ type: Number, required: true })
  subtotal: number;

  @Prop({ type: Number, required: true })
  total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export type OrderType = HydratedDocument<Order>;
