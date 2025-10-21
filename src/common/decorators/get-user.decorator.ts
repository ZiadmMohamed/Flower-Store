import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PayloadType } from 'src/modules/auth/constants';

export const GetUser = createParamDecorator(
  (_: never, ctx: ExecutionContext): PayloadType => {
    const req = ctx.switchToHttp().getRequest();

    return req.authUser as PayloadType;
  },
);
