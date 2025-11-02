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
  page?: number;
}
export interface Ipaginate<TDoc> {
  items: number;
  currentPages: number;
  data: TDoc[] | [];
  itemsPerPage: number;
  numberOfpages: number;
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

    populate = [],
    page = 1,
  }: IFind<TDoc>): Promise<TDoc[] | Ipaginate<TDoc> | []> {
    if (page) {
      const limit = 7;
      const skip = (page - 1) * limit;
      const items = await this.model.countDocuments(filters || {});
      const data = await this.model
        .find(filters || {})
        .skip(skip)
        .limit(limit)
        .exec();
      const itemsPerPage = data.length;
      const pages = Math.ceil(items / limit);
      return {
        items,
        currentPages: page,
        data,
        itemsPerPage,
        numberOfpages: Number(pages),
      };
    }
    if (populate) {
      return await this.model.find(filters || {}).populate(populate);
    }
    return await this.model.find(filters || {}).exec();
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
