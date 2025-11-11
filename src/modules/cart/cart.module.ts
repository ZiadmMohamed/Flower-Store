import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepo } from './cart.repo';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schema/cart.schema';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/common/services/token.service';

@Module({
  controllers: [CartController],
  providers: [CartService, CartRepo, TokenService, JwtService],
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    UsersModule,
  ],
  exports: [CartService, CartRepo],
})
export class CartModule {}
