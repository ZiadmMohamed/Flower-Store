import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoles } from '../users/schema/user.types';
import { UserType } from '../users/schema/user.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Roles([UserRoles.USER, UserRoles.ADMIN])
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: UserType,
  ) {
    return this.ordersService.createOrder(createOrderDto, user._id);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Roles([UserRoles.USER, UserRoles.ADMIN])
  async getOrders(@GetUser() user: UserType) {
    return this.ordersService.getOrders(user._id);
  }
}
