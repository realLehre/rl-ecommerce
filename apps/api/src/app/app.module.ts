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
import { ApiCartService } from './api-cart/api-cart.service';
import { ApiCartController } from './api-cart/api-cart.controller';
import { ApiOrderService } from './api-order/api-order.service';
import { ApiOrderController } from './api-order/api-order.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    ApiUserController,
    ApiAddressController,
    ApiCategoryController,
    ApiProductController,
    ApiCartController,
    ApiOrderController,
  ],
  providers: [
    AppService,
    PrismaService,
    ApiUserService,
    ApiAddressService,
    ApiCategoryService,
    ApiProductService,
    ApiCartService,
    ApiOrderService,
  ],
})
export class AppModule {}
