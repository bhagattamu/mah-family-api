import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';
import { LanguageSchema } from './schemas/language.schema';
import { UserLanguageSchema } from './schemas/user-language.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'language', schema: LanguageSchema },
            { name: 'user-language', schema: UserLanguageSchema }
        ])
    ],
    controllers: [LanguageController],
    providers: [LanguageService],
    exports: [LanguageService]
})
export class LanguageModule {}
