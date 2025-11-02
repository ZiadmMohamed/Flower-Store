import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/common/services/token.service';
import { AuthService } from '../auth/auth.service';
import { UserRepo } from '../Repositories/user.repo';
import { OTPService } from 'src/common/services/otp.service';
import { MailerService } from 'src/common/services/mailer.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    UserRepo,
    TokenService,
    JwtService,
    OTPService,
    MailerService,
  ],
})
export class UsersModule {}
