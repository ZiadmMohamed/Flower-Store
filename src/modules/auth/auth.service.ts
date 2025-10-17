import { Injectable } from '@nestjs/common';
import { SignUpDTO } from './DTOs/auth.dto';

@Injectable()
export class AuthService {
  constructor() {}

  async signUpService(body: SignUpDTO) {
    return body;
  }
}
