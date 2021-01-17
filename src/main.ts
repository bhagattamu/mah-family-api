import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PAGE_VISIT_LIMIT, PORT, SIGN_UP_LIMIT } from './@core/config';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { warn } from 'console';
import { MahUserModule } from './controllers/user/mah-user/mah-user.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.use(helmet());
    app.use(
        rateLimit({
            windowMs: 12 * 16 * 1000,
            max: PAGE_VISIT_LIMIT,
            message: 'Too many requests from this IP, please try again later.'
        })
    );
    app.use(
        '/api/v1/user/register',
        rateLimit({
            windowMs: 60 * 60 * 1000,
            max: SIGN_UP_LIMIT,
            message: 'To many accounts created from this IP, please try again after an hour'
        })
    );
    const options = new DocumentBuilder()
        .setTitle('API')
        .setDescription('API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, options, {
        include: [MahUserModule]
    });
    SwaggerModule.setup('api', app, document);
    await app.listen(PORT || 3000);
    warn(`App is listening to port ${PORT}`);
}
bootstrap();
