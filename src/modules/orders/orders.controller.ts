import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRoles } from '../users/schema/user.types';
import { UserType } from '../users/schema/user.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Roles([UserRoles.USER, UserRoles.ADMIN])
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: UserType,
  ) {
    return this.ordersService.createOrder(createOrderDto, user._id);
  }
}
