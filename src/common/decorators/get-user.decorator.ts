import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserType } from '../../modules/users/schema/user.schema';

export const GetUser = createParamDecorator(
  (_: never, ctx: ExecutionContext): UserType => {
    const req = ctx.switchToHttp().getRequest();

    return req.authUser as UserType;
  },
);
