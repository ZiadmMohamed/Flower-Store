import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { diskStorage, FileFilterCallback } from 'multer';
export const MulterOption = ({
  validation,
  fileSize = 1024 * 1024,
}): MulterOptions => {
  return {
    storage: diskStorage({}),
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      cb: FileFilterCallback,
    ) => {
      if (!validation.includes(file.mimetype)) {
        throw new BadRequestException('file type fomart is invalid');
      }
      cb(null, true);
    },
    limits: { fileSize },
  };
};
