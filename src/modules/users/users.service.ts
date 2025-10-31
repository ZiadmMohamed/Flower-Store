import { Injectable } from '@nestjs/common';
import { UserRepo } from 'src/modules/users/user.repo';
import { UserType } from './schema/user.schema';
import { UpdateUserDTO } from './DTOs/users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepo) {}

  async viewProfile(authUser: UserType) {
    return await this.userRepo.findByEmail(authUser.email);
  }

  async updateProfile(authUser: UserType, body: UpdateUserDTO) {
    await this.userRepo.updateOne({ _id: authUser._id }, body);
    return { message: 'Profile updated successfully' };
  }
}
