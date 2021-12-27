import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConfig } from './configs/typeorm.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forRoot(typeOrmConfig), UserModule, AuthModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
