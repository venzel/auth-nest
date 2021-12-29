import { MailerService } from '@nestjs-modules/mailer';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRepository } from 'src/modules/user/user.repository';
import { CreateUserDto } from '../user/dtos/create.user.dto';
import { CredentialsDto } from '../user/dtos/credentials.dto';
import { ResponseUserDto } from '../user/dtos/response.user.dto';
import { UserMessage } from '../user/user.message.enum';
import { UserRole } from '../user/user.role.enum';
import { emailAdmin } from '../../configs/geral.config';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
        private mailerService: MailerService
    ) {}

    async signUp(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
        const existsUser = await this.userRepository.findOneByEmail(createUserDto.email);

        if (existsUser) {
            throw new ConflictException(UserMessage.CONFLICT);
        }

        const user = await this.userRepository.createUser(createUserDto, UserRole.USER);

        const { email, confirmationToken } = user;

        const mail = {
            to: email,
            from: emailAdmin,
            subject: 'Email de confirmação',
            template: 'email-confirmation',
            context: {
                token: confirmationToken,
            },
        };

        await this.mailerService.sendMail(mail);

        return {
            user: user,
            message: UserMessage.CREATED,
        };
    }

    async signIn(credentialsDto: CredentialsDto): Promise<{ token: string }> {
        const user = await this.userRepository.checkCredentials(credentialsDto);

        if (!user) {
            throw new UnauthorizedException(UserMessage.UNAUTHORIZED);
        }

        const payload = {
            id: user.id,
        };

        const token = this.jwtService.sign(payload);

        return { token };
    }
}
