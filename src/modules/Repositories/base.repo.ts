import { Model, FilterQuery, PopulateOptions, Document } from 'mongoose';

interface IFindOne<TDoc> {
  filters: FilterQuery<TDoc>;
  select?: string;
  populate?: PopulateOptions[];
}

interface IFind<TDoc> {
  filters?: FilterQuery<TDoc>;
  select?: string;
  populate?: PopulateOptions[];
}

export abstract class BaseRepo<TDoc extends Document> {
  constructor(private readonly model: Model<TDoc>) {}

  async create(data: Partial<TDoc>): Promise<TDoc> {
    return this.model.create(data);
  }

  async save(newDoc: TDoc) {
    return newDoc.save();
  }

  async findOne({
    filters,
    select = '',
    populate = [],
  }: IFindOne<TDoc>): Promise<TDoc | null> {
    return this.model.findOne(filters, select).populate(populate);
  }

  async find({
    filters = {},
    select = '',
    populate = [],
  }: IFind<TDoc>): Promise<TDoc[]> {
    return this.model.find(filters, select).populate(populate);
  }

  async deleteOne(filters: FilterQuery<TDoc>) {
    if (filters._id) await this.model.findByIdAndDelete(filters._id);
    return this.model.findOneAndDelete(filters);
  }

  async updateOne(filters: FilterQuery<TDoc>, data: Partial<TDoc>) {
    if (filters._id) await this.model.findByIdAndUpdate(filters._id, data);
    return this.model.findOneAndUpdate(filters, data, { new: true });
  }
}
