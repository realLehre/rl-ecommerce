import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { ApiProductService } from './api-product.service';

@Controller('product')
export class ApiProductController {
  constructor(private productService: ApiProductService) {}

  @Get('all')
  async getProducts(
    @Query('categoryId') categoryId?: string,
    @Query('subCategoryId') subCategoryId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sortBy') sortBy?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.productService.getProducts({
      categoryId,
      subCategoryId,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sortBy,
      page: page ? parseInt(page) : undefined,
      pageSize: pageSize ? parseInt(pageSize) : undefined,
    });
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

  @Get()
  async searchProducts(@Query('search') search: string) {
    return this.productService.searchProducts(search);
  }
}
