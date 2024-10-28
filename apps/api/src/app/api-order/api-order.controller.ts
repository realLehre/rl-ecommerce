import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOrderService, IOrderBody } from './api-order.service';

@Controller('order')
export class ApiOrderController {
  constructor(private orderService: ApiOrderService) {}

  @Get(':id')
  async getOrder(
    @Param('id') userId: string,
    @Query('orderId') orderId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minDate') minDate?: any,
    @Query('maxDate') maxDate?: any,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('deliveryStatus') deliveryStatus?: string,
  ) {
    return this.orderService.getOrder(userId, {
      orderId,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      page: page ? parseInt(page) : undefined,
      pageSize: pageSize ? parseInt(pageSize) : undefined,
      deliveryStatus,
      minDate,
      maxDate,
    });
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
