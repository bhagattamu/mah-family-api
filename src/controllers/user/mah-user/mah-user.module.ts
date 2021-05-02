import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMoudle } from 'src/@core/auth/auth.module';
import { LanguageModule } from 'src/controllers/anscestry/language/language.module';
import { MailModule } from 'src/controllers/utils/mail/mail.module';
import { MahUserController } from './mah-user.controller';
import { MahUserService } from './mah-user.service';
import { MahUserSchema } from './schema/mah-user.schema';
import { UserFamilySchema } from './schema/user-family.schema';
import { UserRecoverySchema } from './schema/user-recovery.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'mah-user', schema: MahUserSchema },
            { name: 'user-recovery', schema: UserRecoverySchema },
            { name: 'user-family', schema: UserFamilySchema }
        ]),
        AuthMoudle,
        MailModule,
        LanguageModule
    ],
    controllers: [MahUserController],
    providers: [MahUserService],
    exports: [MahUserService]
})
export class MahUserModule {}
