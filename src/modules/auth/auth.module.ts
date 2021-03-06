import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from 'src/modules/user/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { tokenSecret, tokenExpires } from '../../configs/geral.config';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRepository]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: tokenSecret,
            signOptions: {
                expiresIn: tokenExpires,
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
