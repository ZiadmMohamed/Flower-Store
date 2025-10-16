import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_ROUTE = 'isPublic';
export const SkipAuth = () => SetMetadata(IS_PUBLIC_ROUTE, true);

export const PHONE_VERIFICATION_OTP_LENGTH = 4;
export const DUMMY_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export interface PayloadType {
  sub: string;
  tokenVersion?: number;
  iat?: number;
  exp?: number;
}
