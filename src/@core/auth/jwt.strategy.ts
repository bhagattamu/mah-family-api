import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_SECRET } from '../config';
import { AuthService } from './auth.service';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // jwtFromRequest: authService.extractJWT(),
            ignoreExpiration: false,
            secretOrKey: JWT_SECRET
        });
    }

    async validate(jwtPayload: IJwtPayload) {
        const user = await this.authService.validateUser(jwtPayload);
        if (!user) {
            throw new UnauthorizedException();
        }
        user.resetPasswordToken = '';
        user.password = '';
        return user;
    }
}
