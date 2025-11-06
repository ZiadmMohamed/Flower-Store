import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { UserRoles, GenderType } from './user.types';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
@Schema()
export class User {
  @Prop({
    required: true,
    type: String,
    trim: true,
    lowercase: true,
  })
  name: string;

  @Prop({
    required: true,
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    index: { name: 'username_index' },
  })
  userName: string;

  @Prop({
    required: true,
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    index: { name: 'email_index' },
  })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({
    required: true,
    type: String,
    enum: UserRoles,
    default: UserRoles.USER,
  })
  role: string;

  @Prop({ type: String, enum: GenderType, default: GenderType.MALE })
  gender: string;

  @Prop({ type: String, unique: true })
  phoneNumber: string;

  @Prop({ type: Boolean, default: false })
  emailVerified: boolean;

  @Prop({ type: Date })
  DOB: Date;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Registers the User schema within NestJS for dependency injection (so it can be used inside services/repositories)
export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

// Defines a TypeScript type for a fully-hydrated Mongoose User document (with Mongoose methods and properties)
export type UserType = HydratedDocument<User>;
