import { ConflictException, Injectable } from '@nestjs/common';
import { SignUpDTO } from './DTOs/auth.dto';
import { UserRepo } from 'src/modules/Repositories/user.repo';

@Injectable()
export class AuthService {
  constructor(private readonly userRepo: UserRepo) {}

  async signUpService(body: SignUpDTO) {
    const { name, userName, email, password, role, gender, phoneNumber, DOB } =
      body;

    const user = await this.userRepo.findByEmail(email);
    if (user) throw new ConflictException('User already exists');

    const newUser = await this.userRepo.create({
      name,
      userName,
      email,
      password,
      role,
      gender,
      phoneNumber,
      DOB,
    });

    return newUser;
  }
}
