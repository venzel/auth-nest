import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/modules/user/user.repository';
import { CredentialsDto } from '../user/dtos/credentials.dto';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository, private jwtService: JwtService) {}

    async signIn(credentialsDto: CredentialsDto): Promise<{ token: string }> {
        const user = await this.userRepository.checkCredentials(credentialsDto);

        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas!');
        }

        const payload = {
            id: user.id,
        };

        const token = this.jwtService.sign(payload);

        return { token };
    }
}
