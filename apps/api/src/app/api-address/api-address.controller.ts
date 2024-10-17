import {
  Body,
  Controller,
  Delete,
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

  @Delete('address/delete/:id')
  async deleteAddress(@Param('id') id: string) {
    return this.addressService.deleteAddress(id);
  }

  @Post(':id/address')
  async addAddress(
    @Param('id') userId: string,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressService.addAddress(userId, createAddressDto);
  }
}
