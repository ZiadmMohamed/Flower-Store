import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
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
import Stripe from 'stripe';
import { OrderIdDTO } from './dto/checkout.order.dto';
import { Request } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('')
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

  @Post("checkout/:orderId")
 @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Roles([UserRoles.USER, UserRoles.ADMIN])  
  async checkout(@Param() params:OrderIdDTO,@GetUser() user:UserType):Promise<{message:string,data:{session: Stripe.Response<Stripe.Checkout.Session>}}>{
  const session=  await this.ordersService.checkout(params.orderId,user)
    return {message:"done",data:{session}}
  }



    @Post("webhook")
   webhook(@Req() req:Request){
  return  this.ordersService.webhook(req)

  }

  
 @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Roles([UserRoles.USER, UserRoles.ADMIN]) 
  @Patch(":orderId/cancel")
  async cancelOrder(@Param() params:OrderIdDTO,@GetUser() user:UserType){
    console.log(params.orderId);
    
 const cancelOrder= await this.ordersService.cancelOrder(params.orderId,user)
    return {message:"done"}
  }

}
