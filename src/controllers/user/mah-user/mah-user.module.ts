import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MahUserController } from './mah-user.controller';
import { MahUserService } from './mah-user.service';
import { MahUserSchema } from './schemas/mah-user.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'mah-user', schema: MahUserSchema }])],
    controllers: [MahUserController],
    providers: [MahUserService],
    exports: [MahUserService]
})
export class MahUserModule {}
