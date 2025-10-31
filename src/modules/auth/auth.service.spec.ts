import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepo } from 'src/modules/users/user.repo';
import { TokenService } from 'src/common/services/token.service';
import { MailerService } from 'src/common/services/mailer.service';
import { OTPService } from 'src/common/services/otp.service';
import { ConflictException } from '@nestjs/common';
import { Hash, compareHash } from 'src/common/Security/hash.security';

jest.mock('src/common/Security/hash.security');

describe('AuthService', () => {
  let authService: AuthService;
  let userRepo: jest.Mocked<UserRepo>;
  let tokenService: jest.Mocked<TokenService>;
  let mailerService: jest.Mocked<MailerService>;
  let otpService: jest.Mocked<OTPService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepo,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            generateToken: jest.fn(),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendOTPEmail: jest.fn(),
          },
        },
        {
          provide: OTPService,
          useValue: {
            generateOTP: jest.fn(),
            saveOTP: jest.fn(),
            verifyOTP: jest.fn(),
            deleteOTP: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepo = module.get(UserRepo);
    tokenService = module.get(TokenService);
    mailerService = module.get(MailerService);
    otpService = module.get(OTPService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ---------------------------------------------------------
  // SIGN UP TESTS
  // ---------------------------------------------------------
  describe('signUpService', () => {
    it('should create a new user, generate OTP and send email', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      (Hash as jest.Mock).mockReturnValue('hashedPass');
      userRepo.create.mockResolvedValue({ email: 'test@test.com' } as any);
      otpService.generateOTP.mockReturnValue('123456');

      const result = await authService.signUpService({
        name: 'Test',
        userName: 'tester',
        email: 'test@test.com',
        password: '123456',
        role: 'user',
        gender: 'male',
        phoneNumber: '01000000000',
        DOB: new Date(),
      });

      expect(userRepo.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(userRepo.create).toHaveBeenCalled();
      expect(otpService.generateOTP).toHaveBeenCalled();
      expect(otpService.saveOTP).toHaveBeenCalledWith(
        'test@test.com',
        '123456',
      );
      expect(mailerService.sendOTPEmail).toHaveBeenCalledWith(
        'test@test.com',
        '123456',
      );
      expect(result).toEqual({
        message: 'User created successfully. Please verify your email.',
      });
    });

    it('should throw if user already exists', async () => {
      userRepo.findByEmail.mockResolvedValue({ email: 'test@test.com' } as any);

      await expect(
        authService.signUpService({
          name: 'Test',
          userName: 'tester',
          email: 'test@test.com',
          password: '123456',
          role: 'user',
          gender: 'male',
          phoneNumber: '01000000000',
          DOB: new Date(),
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ---------------------------------------------------------
  // VERIFY ACCOUNT TESTS
  // ---------------------------------------------------------
  describe('verifyAccountService', () => {
    it('should verify account and delete OTP', async () => {
      const mockUser = {
        email: 'test@test.com',
        save: jest.fn().mockResolvedValue(true),
      };

      userRepo.findByEmail.mockResolvedValue(mockUser as any);
      otpService.verifyOTP.mockResolvedValue(true);

      const result = await authService.verifyAccountService({
        email: 'test@test.com',
        otp: '123456',
      });

      expect(userRepo.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(otpService.verifyOTP).toHaveBeenCalledWith(
        'test@test.com',
        '123456',
      );
      expect(mockUser.save).toHaveBeenCalled();
      expect(otpService.deleteOTP).toHaveBeenCalledWith('test@test.com');
      expect(result).toEqual({ message: 'Account verified successfully' });
    });

    it('should throw if user not found', async () => {
      userRepo.findByEmail.mockResolvedValue(null);

      await expect(
        authService.verifyAccountService({
          email: 'none@test.com',
          otp: '111111',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw if OTP is invalid', async () => {
      const mockUser = { email: 'test@test.com' };
      userRepo.findByEmail.mockResolvedValue(mockUser as any);
      otpService.verifyOTP.mockResolvedValue(false);

      await expect(
        authService.verifyAccountService({
          email: 'test@test.com',
          otp: '000000',
        }),
      ).rejects.toThrow('Invalid OTP');
    });
  });

  // ---------------------------------------------------------
  // LOGIN TESTS
  // ---------------------------------------------------------
  describe('loginService', () => {
    it('should return access token for valid user', async () => {
      userRepo.findByEmail.mockResolvedValue({
        _id: '1',
        email: 'test@test.com',
        password: 'hashedPass',
      } as any);
      (compareHash as jest.Mock).mockReturnValue(true);
      tokenService.generateToken.mockReturnValue('token123');

      const result = await authService.loginService({
        email: 'test@test.com',
        password: '123456',
      });

      expect(compareHash).toHaveBeenCalledWith('123456', 'hashedPass');
      expect(tokenService.generateToken).toHaveBeenCalled();
      expect(result).toEqual({ accessToken: 'token123' });
    });

    it('should throw if user not found or password invalid', async () => {
      userRepo.findByEmail.mockResolvedValue(null);

      await expect(
        authService.loginService({
          email: 'invalid@test.com',
          password: '123456',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
