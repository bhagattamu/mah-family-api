import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { IUser } from 'src/controllers/user/mah-user/interfaces/user.interface';
import Cryptr from 'cryptr';
import { CRYPTR_JWT_SECRET } from '../config';

@Injectable()
export class AuthService {
    private cryptr: Cryptr;
    constructor(@InjectModel('mah-user') private readonly UserModel: Model<IUser>) {
        this.cryptr = new Cryptr(CRYPTR_JWT_SECRET);
    }

    async validateUser(jwtPayload: any): Promise<any> {
        const user = await this.UserModel.findOne({ _id: jwtPayload.userId, verified: true });
        if (!user) {
            throw new UnauthorizedException('User not found.');
        }
        return user;
    }

    private extractJWT(request: Request) {
        let token: string = '';
        if (request.header('x-token')) {
            token = request.get('x-token');
        } else if (request.headers.authorization) {
            token = request.headers.authorization.replace('Bearer ', '').replace(' ', '');
        } else if (request.body.token) {
            token = request.body.token.replace(' ', '');
        } else if (request.query.token) {
            token = request.body.token.replace(' ', '');
        }
        if (token) {
            try {
                token = this.cryptr.decrypt(token);
            } catch (err) {
                throw new BadRequestException('Request from bad token.');
            }
        }
        return token;
    }

    getJWT() {
        return this.extractJWT;
    }
}
