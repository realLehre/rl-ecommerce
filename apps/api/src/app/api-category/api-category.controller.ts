import { Body, Controller, Post } from '@nestjs/common';
import { ApiCategoryService } from './api-category.service';

@Controller('category')
export class ApiCategoryController {
  constructor(private categoryService: ApiCategoryService) {}

  @Post('create')
  async addCategory(@Body() data: { name: string; subCategories?: string[] }) {
    await this.categoryService.addCategory(data);
  }
}
