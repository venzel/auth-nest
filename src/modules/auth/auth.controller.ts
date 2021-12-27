import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CredentialsDto } from '../user/dtos/credentials.dto';
import { User, UserRole } from '../user/user.entity';
import { GetUser } from './get.user.decorator';
import { Role } from './role.decorator';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/sigin')
    async signIn(@Body() credentialsDto: CredentialsDto): Promise<{ token: string }> {
        return await this.authService.signIn(credentialsDto);
    }

    @Get('/me')
    @UseGuards(AuthGuard())
    getMe(@GetUser() user: User): User {
        return user;
    }

    @Get('/dashboard')
    @Role(UserRole.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    dashboard(@GetUser() user: User): User {
        return user;
    }
}
