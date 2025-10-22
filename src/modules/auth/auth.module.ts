import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModel } from '../users/schema/user.schema';
import { UserRepo } from 'src/modules/Repositories/user.repo';
import { TokenService } from 'src/common/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { RedisModule } from 'src/common/redis/redis.module';
import { MailerService } from 'src/common/services/mailer.service';
import { OTPService } from 'src/common/services/otp.service';

@Module({
  imports: [UserModel, RedisModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepo,
    TokenService,
    JwtService,
    OTPService,
    MailerService,
  ],
})
export class AuthModule {}
