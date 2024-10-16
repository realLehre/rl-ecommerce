import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiAddressService } from './api-address.service';
import { CreateAddressDto } from './create-address.dto';

@Controller('users')
export class ApiAddressController {
  constructor(private addressService: ApiAddressService) {}

  @Get(':id/address')
  async getAddress(@Param('id') id: string) {
    return this.addressService.getAddress(id);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.addressService.getAddressById(id);
      console.log('Controller layer result:', user);
      return user;
    } catch (error) {
      console.error('Controller layer error:', error);
      throw error;
    }
  }

  @Post(':id/address')
  async addAddress(
    @Param('id') userId: string,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressService.addAddress(userId, createAddressDto);
  }
}
