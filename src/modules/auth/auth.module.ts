import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModel } from '../users/schema/user.schema';
import { UserRepo } from 'src/modules/Repositories/user.repo';

@Module({
  imports: [UserModel],
  controllers: [AuthController],
  providers: [AuthService, UserRepo],
})
export class AuthModule {}
