import { Module, HttpModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { MahUserSchema } from 'src/controllers/user/mah-user/schema/mah-user.schema';
import { JWT_SECRET, TOKEN_EXPIRY_TIME } from '../config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { RefreshTokenSchema } from './schema/refresh-token.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'mah-user', schema: MahUserSchema },
            { name: 'refresh-token', schema: RefreshTokenSchema }
        ]),
        PassportModule,
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: { expiresIn: TOKEN_EXPIRY_TIME }
        }),
        HttpModule
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService]
})
export class AuthMoudle {}
