import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_URI } from './@core/config';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './controllers/user/user.module';
import { AncestryModule } from './controllers/anscestry/ancestry.module';
import { MulterModule } from '@nestjs/platform-express';
import { UtilsModule } from './controllers/utils/utils.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(MONGO_URI, { useFindAndModify: false, useCreateIndex: true, useNewUrlParser: true }),
        MulterModule.register({
            dest: './uploads'
        }),
        UserModule,
        AncestryModule,
        UtilsModule
    ]
})
export class AppModule {}
