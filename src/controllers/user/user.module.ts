import { Module } from '@nestjs/common';
import { MahUserModule } from './mah-user/mah-user.module';

@Module({
    imports: [MahUserModule]
})
export class UserModule {}
