import { Types } from 'mongoose';

export interface ICategory {
  categoryName: String;
  createdBy: Types.ObjectId;
  updateBy: Types.ObjectId;
}
