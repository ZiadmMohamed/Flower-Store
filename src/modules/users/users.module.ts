import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/common/services/token.service';
import { AuthService } from '../auth/auth.service';
import { UserRepo } from '../Repositories/user.repo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, UserRepo, TokenService, JwtService],
})
export class UsersModule {}
