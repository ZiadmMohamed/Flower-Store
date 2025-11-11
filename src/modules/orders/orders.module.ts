import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderRepo } from './orders.repo';
import { Order, OrderSchema } from './schema/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenService } from '../../common/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ProductModule } from '../product/product.module';
import { ProductExistsConstraint } from '../../common/validators/product-exists.validator';
import { CartModule } from '../cart/cart.module';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrderRepo,
    TokenService,
    JwtService,
    ProductExistsConstraint,
  ],
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    UsersModule,
    ProductModule,
    CartModule,
  ],
})
export class OrdersModule {}
