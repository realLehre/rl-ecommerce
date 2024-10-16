import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {PrismaService} from "./prisma.service";
import {ApiUserService} from "./api-user/api-user.service";
import {ApiUserController} from "./api-user/api-user.controller";

@Module({
  imports: [],
  controllers: [AppController,ApiUserController],
  providers: [AppService, PrismaService, ApiUserService],
})
export class AppModule {}
