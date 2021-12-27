import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { CreateUserDto } from './dtos/create.user.dto';
import { ResponseListUserDto } from './dtos/response.list.user.dto';
import { ResponseUserDto } from './dtos/response.user.dto';
import { UpdateUserDto } from './dtos/update.user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    async createHandle(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
        return await this.userService.createUser(createUserDto);
    }

    @Put(':id')
    async updateHandle(@Param('id') id: string, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
        return await this.userService.updateUser(id, updateUserDto);
    }

    @Get()
    async listHandle(): Promise<ResponseListUserDto> {
        return await this.userService.listUsers();
    }

    @Get(':id')
    async showHandle(@Param('id') id: string): Promise<ResponseUserDto> {
        return await this.userService.showUser(id);
    }

    @Delete(':id')
    async deleteHandle(@Param('id') id: string): Promise<ResponseUserDto> {
        return await this.userService.deleteUser(id);
    }
}
