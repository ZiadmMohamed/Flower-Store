import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
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
  @ApiOperation({
    summary: 'Checkout - Create order asynchronously',
    description:
      'Enqueues an order checkout job and returns immediately with a job ID for tracking',
  })
  @ApiResponse({
    status: 200,
    description: 'Order checkout job enqueued successfully',
    schema: {
      example: {
        jobId: '12345',
        status: 'queued',
        message: 'Order is being processed',
      },
    },
  })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: UserType,
  ) {
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
  @ApiParam({ name: 'jobId', description: 'The job ID returned from checkout' })
  @ApiResponse({
    status: 200,
    description: 'Job status retrieved successfully',
    schema: {
      example: {
        id: '12345',
        state: 'completed',
        progress: 0,
        result: { orderNumber: 'ORD-20251111-000001' },
        failedReason: null,
      },
    },
  })
  async getOrderStatus(@Param('jobId') jobId: string) {
    return this.ordersService.getJobStatus(jobId);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Roles([UserRoles.USER, UserRoles.ADMIN])
  async getOrders(@GetUser() user: UserType) {
    return this.ordersService.getOrders(user._id);
  }
}
