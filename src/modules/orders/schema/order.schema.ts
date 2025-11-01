import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/modules/product/schema/product.model';
import { User } from 'src/modules/users/schema/user.schema';
import { PAYMENT_METHODS } from '../dto/create-order.dto';

export type OrderDocument = HydratedDocument<Order>;

class OrderProductItem {
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  productId: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1 })
  quantity: number;
}

@Schema({ timestamps: true })
export class Order {
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

  @Prop({ type: String, required: false })
  promoCode?: string;

  @Prop({ type: [OrderProductItem], required: true })
  products: OrderProductItem[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export type OrderType = HydratedDocument<Order>;
