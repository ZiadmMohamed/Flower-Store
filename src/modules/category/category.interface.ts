import { Types } from 'mongoose';

export interface ICategory {
  categoryName: string;
  createdBy: Types.ObjectId;
  updateBy: Types.ObjectId;
}
