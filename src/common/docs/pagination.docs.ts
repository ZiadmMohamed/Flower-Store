import { PaginationQueryParams } from '../../common/dtos/pagination.query-params.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const ApiPagination = () => {
  return applyDecorators(ApiQuery({ type: PaginationQueryParams }));
};
