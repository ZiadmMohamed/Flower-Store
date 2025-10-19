import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModel } from '../users/schema/user.schema';
import { UserRepo } from 'src/modules/Repositories/user.repo';
<<<<<<< HEAD
=======
import { TokenService } from 'src/common/services/token.service';
import { JwtService } from '@nestjs/jwt';
>>>>>>> 695f81b0ac5a2e7fca1a81b361e6e12ba9f8290a

@Module({
  imports: [UserModel],
  controllers: [AuthController],
  providers: [AuthService, UserRepo, TokenService, JwtService],
})
export class AuthModule {}
