import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export const ApiAcceptLanguage = () => {
  return applyDecorators(
    ApiHeader({
      name: 'accept-language',
      description: 'Language code for the response use: en or ar',
      example: 'en',
    }),
  );
};
