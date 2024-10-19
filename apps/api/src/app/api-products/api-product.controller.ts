import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { ApiProductService } from './api-product.service';

@Controller('product')
export class ApiProductController {
  constructor(private productService: ApiProductService) {}

  @Get('all')
  async getProducts() {
    return this.productService.getProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Get(':productId/similar/:categoryId')
  getSimilarProducts(
    @Param('productId') productId: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.productService.getSimilarProducts(categoryId, productId);
  }

  @Post('create')
  async addProduct(@Body() data: any) {
    await this.productService.addProduct(data);
  }
}
