import { HydratedDocument, Types } from 'mongoose';
import { Iimage, Iproduct, productStatus } from '../product.interface';
import {
  MongooseModule,
  Prop,
  raw,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import slugify from 'slugify';
@Schema({ timestamps: true })
export class Product implements Iproduct {
  @Prop({ required: true, min: 4 })
  productName: string;
  @Prop({ required: true, min: 4 })
  description: string;
  @Prop({ type: Types.ObjectId, required: true })
  createdBy: Types.ObjectId;
  @Prop({ type: Number, required: true })
  stock: number;
  @Prop({ type: Number, required: true })
  originalPrice: number;
  @Prop({ type: Number, required: true })
  finalPrice: number;
  @Prop(
    raw({
      secure_url: { type: String, required: true },
      publick_id: { type: String, required: true },
    }),
  )
  image: Iimage;
  @Prop({ type: String, enum: productStatus, default: productStatus.INSTOCK })
  status: productStatus;
  @Prop({
    required: false,
    default: function (this: Product) {
      return slugify(this.productName, { trim: true });
    },
  })
  slug: string;
}
export type productDocument = HydratedDocument<Product>;
export const productSchema = SchemaFactory.createForClass(Product);
export const productModel = MongooseModule.forFeatureAsync([
  {
    name: Product.name,
    useFactory() {
      productSchema.pre('updateOne', function (next) {
        let update = this.getUpdate();
        if (update['productName']) {
          update['slug'] = slugify(update['productName'], { trim: true });
          this.setUpdate(update);
          next();
        }
      });
      return productSchema;
    },
  },
]);
