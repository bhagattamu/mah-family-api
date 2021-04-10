import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { APP_MAIL, APP_MAIL_SECRET } from 'src/@core/config';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: APP_MAIL,
                        pass: APP_MAIL_SECRET
                    }
                },
                defaults: {
                    from: '"nest-modules" <modules@nestjs.com>'
                },
                template: {
                    dir: process.cwd() + '/src/controllers/utils/mail/templates/',
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true
                    }
                },
                options: {
                    partials: {
                        dir: process.cwd() + '/src/controllers/utils/mail/templates/partials/',
                        options: {
                            strict: true
                        }
                    }
                }
            })
        })
    ],
    providers: [MailService],
    exports: [MailService]
})
export class MailModule {}
