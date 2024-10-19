import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCategoryService } from './api-category.service';

@Controller('category')
export class ApiCategoryController {
  constructor(private categoryService: ApiCategoryService) {}

  @Post('create')
  async addCategory(@Body() data: { name: string; subCategories?: string[] }) {
    await this.categoryService.addCategory(data);
  }

  @Get()
  async getCategories() {
    return this.categoryService.getCategories();
  }
}
