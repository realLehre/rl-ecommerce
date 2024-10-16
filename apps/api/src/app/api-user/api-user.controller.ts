import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import {ApiUserService} from "./api-user.service";


@Controller('users')
export class ApiUserController {
    constructor(private userService: ApiUserService) {}

    @Get()
    async getUsers(){
        return this.userService.getUsers()
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.userService.getUserById(id);
    }
}