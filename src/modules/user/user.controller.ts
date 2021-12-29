import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GetUser } from '../auth/get.user.decorator';
import { Role } from '../auth/role.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUserDto } from './dtos/create.user.dto';
import { FindUsersQueryDto } from './dtos/find.users.query.dto';
import { ResponseListUserDto } from './dtos/response.list.user.dto';
import { ResponseUserDto } from './dtos/response.user.dto';
import { UpdateUserDto } from './dtos/update.user.dto';
import { User } from './user.entity';
import { UserRole } from './user.role.enum';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/find')
    @Role(UserRole.ADMIN)
    async findUsersHandle(@Query() queryDto: FindUsersQueryDto) {
        return await this.userService.findUsers(queryDto);
    }

    @Post()
    @Role(UserRole.ADMIN)
    async createUserAdminHandle(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
        return await this.userService.createUserAdmin(createUserDto);
    }

    @Put(':id')
    @Role(UserRole.ADMIN)
    async updateUserHandle(@Body() dto: UpdateUserDto, @GetUser() user: User, @Param('id') id: string): Promise<ResponseUserDto> {
        return await this.userService.updateUser(dto, user, id);
    }

    @Get()
    @Role(UserRole.ADMIN)
    async listUsersHandle(): Promise<ResponseListUserDto> {
        return await this.userService.listUsers();
    }

    @Get(':id')
    @Role(UserRole.ADMIN)
    async showUserHandle(@Param('id') id: string): Promise<ResponseUserDto> {
        return await this.userService.showUser(id);
    }

    @Delete(':id')
    @Role(UserRole.ADMIN)
    async deleteUserHandle(@Param('id') id: string): Promise<ResponseUserDto> {
        return await this.userService.deleteUser(id);
    }
}
