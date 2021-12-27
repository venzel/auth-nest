import { EntityRepository, getRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { CreateUserDto } from './dtos/create.user.dto';
import { CredentialsDto } from './dtos/credentials.dto';
import { User } from './user.entity';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    private repository: Repository<User>;

    constructor() {
        super();
        this.repository = getRepository<User>(User);
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

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { name, email, password } = createUserDto;

        const role = 'USER';
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
            throw new InternalServerErrorException('Error saving to database!');
        }
    }

    async checkCredentials(credentialsDto: CredentialsDto): Promise<User> {
        const { email, password } = credentialsDto;

        const user = await this.repository.findOne({ email, status: true });

        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas!');
        }

        const checkPassword = await user.checkPassword(password);

        return user && checkPassword ? user : null;
    }

    async saveUser(user: User): Promise<User> {
        try {
            const currentDate = new Date();

            user.updatedAt = currentDate;

            await this.repository.save(user);

            return user;
        } catch (_) {
            throw new InternalServerErrorException('Error saving to database!');
        }
    }

    async deleteUser(user: User): Promise<User> {
        try {
            await this.repository.delete(user);

            return user;
        } catch (_) {
            throw new InternalServerErrorException('Error saving to database!');
        }
    }
}
