import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../user/user.repository';
import { UserService } from './user.service';

const mockUserRepository = () => ({
    findUsers: jest.fn(),
    findOneByEmail: jest.fn(),
    findOneById: jest.fn(),
    createUser: jest.fn(),
    saveUser: jest.fn(),
    deleteUser: jest.fn(),
});

describe('UserService', () => {
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
});
