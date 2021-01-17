import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_SECRET } from '../config';
import { AuthService } from './auth.service';
import { IJwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: authService.getJWT(),
            ignoreExpiration: false,
            secretOrKey: JWT_SECRET
        });
    }

    async validate(jwtPayload: IJwtPayload) {
        const user = await this.authService.validateUser(jwtPayload);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
