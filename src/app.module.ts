import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_URI } from './@core/config';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './controllers/user/user.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), MongooseModule.forRoot(MONGO_URI), UserModule]
})
export class AppModule {}
