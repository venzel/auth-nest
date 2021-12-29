import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create.user.dto';
import { CredentialsDto } from './dtos/credentials.dto';
import { FindUsersQueryDto } from './dtos/find.users.query.dto';
import { ResponseFindUsersDto } from './dtos/response.find.users.dto';
import { User } from './user.entity';
import { UserMessage } from './user.message.enum';
import { UserRole } from './user.role.enum';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    private repository: Repository<User>;

    constructor() {
        super();
        this.repository = getRepository<User>(User);
    }

    async findUsers(queryDto: FindUsersQueryDto): Promise<ResponseFindUsersDto> {
        queryDto.status = !queryDto.status ? true : queryDto.status;
        queryDto.page = queryDto.page < 1 || !queryDto.page ? 1 : queryDto.page;
        queryDto.limit = queryDto.limit > 100 || !queryDto.limit ? 100 : queryDto.limit;

        let { email, name, status, role } = queryDto;

        const query = this.createQueryBuilder('user');

        query.where('user.status = :status', { status });

        if (email) {
            query.andWhere('user.email ILIKE :email', { email: `%${email}%` });
        }

        if (name) {
            query.andWhere('user.name ILIKE :name', { name: `%${name}%` });
        }

        if (role) {
            query.andWhere('user.role = :role', { role: role.toUpperCase() });
        }

        query.skip((queryDto.page - 1) * queryDto.limit);

        query.take(+queryDto.limit);

        query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);

        query.select(['user.name', 'user.email', 'user.role', 'user.status']);

        const [users, total] = await query.getManyAndCount();

        return {
            users,
            total,
        };
    }

    async findOneByEmail(email: string): Promise<User | undefined> {
        return await this.repository.findOne({
            where: { email },
            select: ['id', 'name', 'email', 'role'],
        });
    }

    async findOneById(id: string): Promise<User | undefined> {
        return await this.repository.findOne({
            where: { id },
            select: ['id', 'name', 'email', 'role'],
        });
    }

    async listAll(): Promise<User[]> {
        return await this.repository.find({
            select: ['id', 'name', 'email', 'role'],
        });
    }

    async createUser(createUserDto: CreateUserDto, role: UserRole): Promise<User> {
        const { name, email, password } = createUserDto;

        const confirmationToken = crypto.randomBytes(32).toString('hex');
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        const user = this.repository.create({ name, email, password: hashPassword, role, salt, confirmationToken });

        try {
            await this.repository.save(user);

            delete user.password;
            delete user.salt;
            delete user.confirmationToken;
            delete user.recoverToken;

            return user;
        } catch (_) {
            throw new InternalServerErrorException(UserMessage.INTERNAL_ERROR);
        }
    }

    async checkCredentials(credentialsDto: CredentialsDto): Promise<User> {
        const { email, password } = credentialsDto;

        const user = await this.repository.findOne({ email, status: true });

        if (!user) {
            throw new UnauthorizedException(UserMessage.UNAUTHORIZED);
        }

        const checkPassword = await user.checkPassword(password);

        return user && checkPassword ? user : null;
    }

    async saveUser(user: User): Promise<User> {
        try {
            Object.assign(user, { updatedAt: new Date() });

            return await this.repository.save(user);
        } catch (_) {
            throw new InternalServerErrorException(UserMessage.INTERNAL_ERROR);
        }
    }

    async deleteUser(user: User): Promise<User> {
        try {
            await this.repository.delete(user);

            return user;
        } catch (_) {
            throw new InternalServerErrorException(UserMessage.INTERNAL_ERROR);
        }
    }
}
