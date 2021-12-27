import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'super-secret',
        });
    }

    async validate(payload: { id: number }): Promise<User> {
        const { id } = payload;

        const user = await this.userRepository.findOne(id, {
            select: ['name', 'email', 'status', 'role'],
        });

        if (!user) {
            throw new UnauthorizedException('Usuário não encontrado!');
        }

        return user;
    }
}
