import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ApiUserService } from './api-user/api-user.service';
import { ApiUserController } from './api-user/api-user.controller';
import { ApiAddressController } from './api-address/api-address.controller';
import { ApiAddressService } from './api-address/api-address.service';

@Module({
  imports: [],
  controllers: [AppController, ApiUserController, ApiAddressController],
  providers: [AppService, PrismaService, ApiUserService, ApiAddressService],
})
export class AppModule {}
