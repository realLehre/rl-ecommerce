import { Body, Controller, Post } from '@nestjs/common';

import { ApiProductService } from './api-product.service';

@Controller('product')
export class ApiProductController {
  constructor(private productService: ApiProductService) {}

  @Post('create')
  async addProduct(@Body() data: any) {
    await this.productService.addProduct(data);
  }
}
