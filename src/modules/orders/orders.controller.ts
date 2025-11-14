import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoles } from '../users/schema/user.types';
import { UserType } from '../users/schema/user.schema';
import { EnqueueCheckoutResponse } from './dto/enqueue-checkout';
import { GetOrderStatusResponse } from './dto/get-order-status.response';
import { OrderType } from './schema/order.schema';
import { Ipaginate } from 'src/utils/base.repo';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Roles([UserRoles.USER, UserRoles.ADMIN])
  @ApiOperation({
    summary: 'Checkout - Create order asynchronously',
    description:
      'Enqueues an order checkout job and returns immediately with a job ID for tracking',
  })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: UserType,
  ): Promise<EnqueueCheckoutResponse> {
    return this.ordersService.enqueueCheckout(createOrderDto, user._id);
  }

  @Get('status/:jobId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Roles([UserRoles.USER, UserRoles.ADMIN])
  @ApiOperation({
    summary: 'Check order processing status',
    description: 'Get the current status of an order checkout job by its ID',
  })
  async getOrderStatus(
    @Param('jobId') jobId: string,
  ): Promise<GetOrderStatusResponse> {
    return this.ordersService.getJobStatus(jobId);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Roles([UserRoles.USER, UserRoles.ADMIN])
  async getOrders(@GetUser() user: UserType): Promise<Ipaginate<OrderType>> {
    return this.ordersService.getOrders(user._id);
  }
}
