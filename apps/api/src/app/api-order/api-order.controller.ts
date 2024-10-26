import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOrderService, IOrderBody } from './api-order.service';

@Controller('order')
export class ApiOrderController {
  constructor(private orderService: ApiOrderService) {}

  @Get(':id')
  async getOrder(@Param('id') userId: string) {
    return this.orderService.getOrder(userId);
  }

  @Get('user/:id')
  async getOrderById(@Param('id') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }

  @Post('create')
  async createOrder(@Body() data: IOrderBody) {
    return this.orderService.createOrder(data);
  }
}
