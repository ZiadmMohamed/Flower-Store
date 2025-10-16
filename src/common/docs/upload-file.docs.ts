import { applyDecorators } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

export const ApiUploadFile = () => {
  return applyDecorators(
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
};

export const ApiUploadFiles = () => {
  return applyDecorators(
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          files: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    }),
  );
};
