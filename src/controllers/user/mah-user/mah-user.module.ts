import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMoudle } from 'src/@core/auth/auth.module';
import { MahUserController } from './mah-user.controller';
import { MahUserService } from './mah-user.service';
import { MahUserSchema } from './schema/mah-user.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'mah-user', schema: MahUserSchema }]), AuthMoudle],
    controllers: [MahUserController],
    providers: [MahUserService],
    exports: [MahUserService]
})
export class MahUserModule {}
