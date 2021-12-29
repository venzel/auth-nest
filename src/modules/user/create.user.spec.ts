import { UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dtos/create.user.dto';

import { UserRepository } from './user.repository';
import { UserRole } from './user.role.enum';
import { UserService } from './user.service';

const mockUserRepository = () => ({
    findUsers: jest.fn(),
    findOneByEmail: jest.fn(),
    findOneById: jest.fn(),
    createUser: jest.fn(),
    saveUser: jest.fn(),
    deleteUser: jest.fn(),
});

describe('UsersService', () => {
    let userRepository = null;
    let service = null;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: UserRepository,
                    useFactory: mockUserRepository,
                },
            ],
        }).compile();

        userRepository = module.get<UserRepository>(UserRepository);
        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(userRepository).toBeDefined();
    });

    describe('createUser', () => {
        let mockCreateUserDto: CreateUserDto;

        beforeEach(() => {
            mockCreateUserDto = {
                email: 'mock@email.com',
                name: 'Mock User',
                password: 'mockPassword',
                passwordConfirmation: 'mockPassword',
            };
        });

        it('should create an user if passwords match!', async () => {
            userRepository.createUser.mockResolvedValue('mockUser');

            const result = await service.createUserAdmin(mockCreateUserDto);

            expect(userRepository.createUser).toHaveBeenCalledWith(mockCreateUserDto, UserRole.ADMIN);

            expect(result).toEqual({ user: 'mockUser', message: 'User created!' });
        });

        it('should throw an error if passwords doesnt match!', async () => {
            mockCreateUserDto.passwordConfirmation = 'wrongPassword';

            expect(service.createUserAdmin(mockCreateUserDto)).rejects.toThrow(UnprocessableEntityException);
        });
    });
});
