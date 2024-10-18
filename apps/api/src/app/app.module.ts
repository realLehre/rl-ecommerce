import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ApiUserService } from './api-user/api-user.service';
import { ApiUserController } from './api-user/api-user.controller';
import { ApiAddressController } from './api-address/api-address.controller';
import { ApiAddressService } from './api-address/api-address.service';
import { ApiCategoryService } from './api-category/api-category.service';
import { ApiCategoryController } from './api-category/api-category.controller';
import { ApiProductService } from './api-products/api-product.service';
import { ApiProductController } from './api-products/api-product.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    ApiUserController,
    ApiAddressController,
    ApiCategoryController,
    ApiProductController,
  ],
  providers: [
    AppService,
    PrismaService,
    ApiUserService,
    ApiAddressService,
    ApiCategoryService,
    ApiProductService,
  ],
})
export class AppModule {}
