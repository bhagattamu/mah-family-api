import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CLIENT_APP, PAGE_VISIT_LIMIT, PORT, SIGN_UP_LIMIT } from './@core/config';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { warn } from 'console';
import { MahUserModule } from './controllers/user/mah-user/mah-user.module';
import { ProjectModule } from './controllers/anscestry/project/project.module';
import { SubjectModule } from './controllers/anscestry/subject/subject.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({ origin: CLIENT_APP, credentials: true });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.use(helmet());
    app.use(cookieParser());
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
        .setTitle('Ancester Culture API')
        .setDescription('API description')
        .addBearerAuth()
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, options, {
        include: [MahUserModule, ProjectModule, SubjectModule]
    });
    SwaggerModule.setup('api', app, document);
    await app.listen(PORT || 3000);
    warn(`App is listening to port ${PORT}`);
}
bootstrap();
