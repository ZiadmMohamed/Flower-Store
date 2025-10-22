import { Injectable } from '@nestjs/common';
import { UserRepo } from 'src/modules/Repositories/user.repo';
import { UserType } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepo) {}

  async viewProfile(authUser: UserType) {
    return await this.userRepo.findByEmail(authUser.email);
  }
}
