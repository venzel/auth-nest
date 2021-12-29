import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dtos/create.user.dto';
import { FindUsersQueryDto } from './dtos/find.users.query.dto';
import { ResponseFindUsersDto } from './dtos/response.find.users.dto';
import { ResponseListUserDto } from './dtos/response.list.user.dto';
import { ResponseUserDto } from './dtos/response.user.dto';
import { UpdateUserDto } from './dtos/update.user.dto';
import { User } from './user.entity';
import { UserMessage } from './user.message.enum';
import { UserRepository } from './user.repository';
import { UserRole } from './user.role.enum';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository) {}

    async findUsers(queryDto: FindUsersQueryDto): Promise<ResponseFindUsersDto> {
        return await this.userRepository.findUsers(queryDto);
    }

    async createUserAdmin(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
        const existsUser = await this.userRepository.findOneByEmail(createUserDto.email);

        const { password, passwordConfirmation } = createUserDto;

        if (password !== passwordConfirmation) {
            throw new UnprocessableEntityException(UserMessage.UNPROCESSABLE);
        }

        if (existsUser) {
            throw new ConflictException(UserMessage.CONFLICT);
        }

        const user = await this.userRepository.createUser(createUserDto, UserRole.ADMIN);

        return {
            user,
            message: UserMessage.CREATED,
        };
    }

    async updateUser(updateUserDto: UpdateUserDto, user: User, id: string): Promise<ResponseUserDto> {
        const existsUser = await this.userRepository.findOneById(id);

        if (!existsUser) {
            throw new NotFoundException(UserMessage.NOT_FOUND);
        }

        if (user.id !== existsUser.id) {
            throw new UnprocessableEntityException(UserMessage.UNPROCESSABLE_ENTITY);
        }

        Object.assign(existsUser, { name: updateUserDto.name });

        await this.userRepository.save(existsUser);

        return {
            user: existsUser,
            message: UserMessage.UPDATED,
        };
    }

    async listUsers(): Promise<ResponseListUserDto> {
        const users = await this.userRepository.listAll();

        return {
            users,
            message: UserMessage.LISTED,
        };
    }

    async showUser(id: string): Promise<ResponseUserDto> {
        const existsUser = await this.userRepository.findOneById(id);

        if (!existsUser) {
            throw new NotFoundException(UserMessage.NOT_FOUND);
        }

        return {
            user: existsUser,
            message: UserMessage.SHOWED,
        };
    }

    async deleteUser(id: string): Promise<ResponseUserDto> {
        const existsUser = await this.userRepository.findOneById(id);

        if (!existsUser) {
            throw new NotFoundException(UserMessage.NOT_FOUND);
        }

        await this.userRepository.deleteUser(existsUser);

        return {
            user: existsUser,
            message: UserMessage.DELETED,
        };
    }
}
