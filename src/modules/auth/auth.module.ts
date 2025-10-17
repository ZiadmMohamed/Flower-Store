import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModel } from '../users/schema/user.schema';
import { UserRepo } from 'src/common/Repositories/user.repo';
import { TokenService } from 'src/common/services/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModel],
  controllers: [AuthController],
  providers: [AuthService, UserRepo, TokenService, JwtService],
})
export class AuthModule {}
