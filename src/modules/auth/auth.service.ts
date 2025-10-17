import { ConflictException, Injectable } from '@nestjs/common';
import { LoginDTO, SignUpDTO } from './DTOs/auth.dto';
import { UserRepo } from 'src/common/Repositories/user.repo';
import { compareHash, Hash } from 'src/common/Security/hash.security';
import { TokenService } from 'src/common/services/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly tokenService: TokenService,
  ) {}

  async signUpService(body: SignUpDTO) {
    const { name, userName, email, password, role, gender, phoneNumber, DOB } =
      body;

    const user = await this.userRepo.findByEmail(email);
    if (user) throw new ConflictException('User already exists');

    // Hash password
    const hashedPassword = Hash(password);

    const newUser = await this.userRepo.create({
      name,
      userName,
      email,
      password: hashedPassword,
      role,
      gender,
      phoneNumber,
      DOB,
    });

    return newUser;
  }

  async loginService(body: LoginDTO) {
    const { email, password } = body;

    const user = await this.userRepo.findByEmail(email);

    if (!user || !compareHash(password, user.password))
      throw new ConflictException('User not found');

    // Generate token
    const accessToken = this.tokenService.generateToken(
      {
        id: user._id,
        email: user.email,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d',
      },
    );

    return { accessToken };
  }
}
