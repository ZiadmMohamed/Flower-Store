import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { OrdersService } from './orders.service';
import { OrderCheckoutJob } from './dto/order-checkout-job';
import { ORDER_QUEUE } from './order.constants';
import { OrderType } from './schema/order.schema';
import { Types } from 'mongoose';

@Processor(ORDER_QUEUE)
export class OrdersProcessor extends WorkerHost {
  private readonly logger = new Logger(OrdersProcessor.name);

  constructor(private readonly ordersService: OrdersService) {
    super();
  }

  async process(job: Job<OrderCheckoutJob>): Promise<OrderType> {
    this.logger.log(`Starting job ${job.id} for user ${job.data.userId}`);

    const result = await this.ordersService.processOrder(
      job.data.dto,
      new Types.ObjectId(job.data.userId),
    );

    this.logger.log(`Completed job ${job.id} - Order: ${result.orderNumber}`);
    return result;
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(
      `Job ${job.id} is now active. Processing order checkout for user ${job.data.userId}`,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job, result: OrderType) {
    this.logger.log(
      `Job ${job.id} completed successfully. Order ${result.orderNumber} created for user ${job.data.userId}`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `Job ${job.id} failed for user ${job.data.userId}. Error: ${error.message}`,
      error.stack,
    );
  }
}
