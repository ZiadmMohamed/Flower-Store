import { ConflictException, Injectable } from '@nestjs/common';
import { LoginDTO, SignUpDTO, VerifyAccountDTO } from './DTOs/auth.dto';
import { UserRepo } from '../users/user.repo';
import { compareHash, Hash } from '../../common/Security/hash.security';
import { TokenService } from '../../common/services/token.service';
import { MailerService } from '../../common/services/mailer.service';
import { OTPService } from '../../common/services/otp.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly tokenService: TokenService,
    private readonly otpService: OTPService,
    private readonly mailerService: MailerService,
  ) {}

  async signUpService(body: SignUpDTO) {
    const { name, userName, email, password, role, gender, phoneNumber, DOB } =
      body;

    const user = await this.userRepo.findByEmail(email);
    if (user) throw new ConflictException('User already exists');

    const hashedPassword = Hash(password);

    await this.userRepo.create({
      name,
      userName,
      email,
      password: hashedPassword,
      role,
      gender,
      phoneNumber,
      DOB,
    });

    // generate & send OTP
    const otp = this.otpService.generateOTP();
    await this.otpService.saveOTP(email, otp);
    this.mailerService.sendOTPEmail(email, otp);

    return { message: 'User created successfully. Please verify your email.' };
  }

  async verifyAccountService(body: VerifyAccountDTO) {
    const { email, otp } = body;

    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new ConflictException('User not found');

    const isVerified = await this.otpService.verifyOTP(email, otp);
    if (!isVerified) throw new ConflictException('Invalid OTP');

    user.emailVerified = true;
    await user.save();

    await this.otpService.deleteOTP(email);

    return { message: 'Account verified successfully' };
  }

  async loginService(body: LoginDTO) {
    const { email, password } = body;

    const user = await this.userRepo.findByEmail(email);

    if (!user || !compareHash(password, user.password))
      throw new ConflictException('Invalid Credentials');

    if (!user.emailVerified)
      throw new ConflictException('Please verify your email');

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
