import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModel } from '../../modules/users/schema/user.schema';
import { UserRepo } from '../../modules/users/user.repo';
import { TokenService } from '../../common/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { RedisModule } from '../../common/redis/redis.module';
import { MailerService } from '../../common/services/mailer.service';
import { OTPService } from '../../common/services/otp.service';

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
