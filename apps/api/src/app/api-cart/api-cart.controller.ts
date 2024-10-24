import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCartService } from './api-cart.service';

@Controller('cart')
export class ApiCartController {
  constructor(private cartService: ApiCartService) {}

  @Get(':id')
  async getOrCreateCart(@Param('id') userId: string) {
    return this.cartService.getOrCreateCart(userId);
  }

  @Post('add')
  async addItemToCart(
    @Body() data: { userId: string; unit: number; productId: string },
  ) {
    return this.cartService.addItemToCart(
      data.unit,
      data.productId,
      data.userId,
    );
  }
}
