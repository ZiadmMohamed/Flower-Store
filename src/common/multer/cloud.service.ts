import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
@Injectable()
export class CloudService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.Cloud_name,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_secret,
    });
  }

  async uploadFile(file: Express.Multer.File, options: UploadApiOptions) {
    return await cloudinary.uploader.upload(file.path, options);
  }
  async destroyFile(public_id: string): Promise<void> {
    return await cloudinary.uploader.destroy(public_id);
  }
}
