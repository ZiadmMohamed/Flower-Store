import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from '../../product/schema/product.model';
import { User } from '../../users/schema/user.schema';

@Schema({ timestamps: true })
class CartProductItem {
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  productId: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1 })
  quantity: number;
}
const CartProductItemSchema = SchemaFactory.createForClass(CartProductItem);
CartProductItemSchema.set('_id', false);

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: [CartProductItemSchema], required: true, default: [] })
  products: CartProductItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
CartSchema.index({ userId: 1 }, { unique: true });

export type CartType = HydratedDocument<Cart>;
export type CartDocument = Cart & Document;
