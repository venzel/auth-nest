import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dtos/create.user.dto';
import { ResponseListUserDto } from './dtos/response.list.user.dto';
import { ResponseUserDto } from './dtos/response.user.dto';
import { UpdateUserDto } from './dtos/update.user.dto';
import { UserRepository } from './user.repository';
import { CREATED, UPDATED, LISTED, SHOWED, DELETED } from './user.utils';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository) {}

    async createUser(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
        const existsUser = await this.userRepository.findOneByEmail(createUserDto.email);

        if (existsUser) {
            throw new ConflictException('User email already exists!');
        }

        const user = await this.userRepository.createUser(createUserDto);

        return {
            user,
            message: CREATED,
        };
    }

    async updateUser(id: string, upateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
        const existsUser = await this.userRepository.findOneById(id);

        if (!existsUser) {
            throw new NotFoundException('User not found!');
        }

        const { name } = upateUserDto;

        Object.assign(existsUser, { name });

        await this.userRepository.save(existsUser);

        return {
            user: existsUser,
            message: UPDATED,
        };
    }

    async listUsers(): Promise<ResponseListUserDto> {
        const users = await this.userRepository.listAll();

        return {
            users,
            message: LISTED,
        };
    }

    async showUser(id: string): Promise<ResponseUserDto> {
        const existsUser = await this.userRepository.findOneById(id);

        if (!existsUser) {
            throw new NotFoundException('User not found!');
        }

        return {
            user: existsUser,
            message: SHOWED,
        };
    }

    async deleteUser(id: string): Promise<ResponseUserDto> {
        const existsUser = await this.userRepository.findOneById(id);

        if (!existsUser) {
            throw new NotFoundException('User not found!');
        }

        await this.userRepository.deleteUser(existsUser);

        return {
            user: existsUser,
            message: DELETED,
        };
    }
}
