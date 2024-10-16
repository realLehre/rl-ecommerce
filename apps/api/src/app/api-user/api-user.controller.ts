import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiUserService } from './api-user.service';

@Controller('users')
export class ApiUserController {
  constructor(private userService: ApiUserService) {}

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.userService.getUserById(id);
      console.log('Controller layer result:', user);
      return user;
    } catch (error) {
      console.error('Controller layer error:', error);
      throw error;
    }
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateData: any) {
    return this.userService.updateUser(id, updateData);
  }
}
