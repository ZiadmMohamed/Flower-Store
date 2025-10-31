import { SetMetadata } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserRoles } from '../users/schema/user.types';

export const IS_PUBLIC_ROUTE = 'isPublic';
export const SkipAuth = () => SetMetadata(IS_PUBLIC_ROUTE, true);

export const PHONE_VERIFICATION_OTP_LENGTH = 4;
export const DUMMY_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export interface PayloadType {
  sub: Types.ObjectId;
  role: UserRoles;
  iat?: number;
  exp?: number;
}
