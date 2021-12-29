import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './configs/winston.config';
import dotenvFlow = require('dotenv-flow');

async function bootstrap() {
    dotenvFlow.config();

    const logger = WinstonModule.createLogger(winstonConfig);

    const app = await NestFactory.create(AppModule, { logger });

    app.useGlobalPipes(new ValidationPipe());

    console.log(process.env.SERVER_PORT);

    await app.listen(3000);
}
bootstrap();
