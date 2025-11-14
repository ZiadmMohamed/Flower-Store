import { CreateOrderDto } from '../dto/create-order.dto';

export interface OrderCheckoutJob {
  dto: CreateOrderDto;
  userId: string;
}
