import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '../user/user.entity';
import { UserMessage } from '../user/user.message.enum';
import { UserRepository } from '../user/user.repository';
import { tokenSecret } from '../../configs/geral.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: tokenSecret,
        });
    }

    async validate(payload: { id: number }): Promise<User> {
        const { id } = payload;

        const user = await this.userRepository.findOne(id, {
            select: ['id', 'name', 'email', 'status', 'role'],
        });

        if (!user) {
            throw new UnauthorizedException(UserMessage.UNAUTHORIZED);
        }

        return user;
    }
}
