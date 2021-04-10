import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { sign, verify } from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';
import { IUser } from 'src/controllers/user/mah-user/interfaces/user.interface';
import { JWT_REFRESH_SECRET, JWT_SECRET, REFRESH_TOKEN_EXPIRY_TIME, TOKEN_EXPIRY_TIME, CRYPTO_REFRESH_SECRET, JWT_RESET_PASSWORD_SECRET, RESET_PASSWORD_TOKEN_EXPIRY_TIME } from '../config';
import { Request, Response } from 'express';
import { IRefreshToken } from './interfaces/refresh-token.interface';
import { IJwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(@InjectModel('mah-user') private readonly UserModel: Model<IUser>, @InjectModel('refresh-token') private readonly RefreshTokenModel: Model<IRefreshToken>) {}

    async validateUser(jwtPayload: any): Promise<any> {
        const user = await this.UserModel.findOne({ _id: jwtPayload.userId });
        if (!user) {
            throw new UnauthorizedException('User not found.');
        } else {
            if (!user.verified) {
                throw new UnauthorizedException('User not verified.');
            }
        }
        return user;
    }

    createAccessToken(userId: string) {
        return sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY_TIME });
    }

    createResetPasswordToken(email: string) {
        return sign({ email }, JWT_RESET_PASSWORD_SECRET, { expiresIn: RESET_PASSWORD_TOKEN_EXPIRY_TIME });
    }

    async createRefreshToken(req: Request, userId: string) {
        const plainRefreshToken = sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY_TIME });
        const encryptedToken = this.encryptByAES(plainRefreshToken, CRYPTO_REFRESH_SECRET).toString();
        await this.buildRefreshToken(req, userId, encryptedToken).save();
        return encryptedToken;
    }

    async isAuthenticated(req: Request) {
        const accessToken = this.extractTokenFromBearer(req);
        const accessTokenPayload = <IJwtPayload>verify(accessToken, JWT_SECRET);
        if (accessTokenPayload && accessTokenPayload.userId) {
            return true;
        }
        return false;
    }

    async refreshToken(req: Request, accessToken: string) {
        const encryptedToken = req.cookies.rtknfam;
        const ipAddress = req.ip;
        const accessTokenPayload = <IJwtPayload>verify(accessToken, JWT_SECRET, { ignoreExpiration: true });
        if (accessTokenPayload && accessTokenPayload.userId) {
            const refreshTokenInfo = await this.RefreshTokenModel.findOne({ refreshToken: encryptedToken }).exec();
            if (refreshTokenInfo) {
                if (refreshTokenInfo.isActive) {
                    const decryptedRefreshToken = this.decryptByAES(refreshTokenInfo.refreshToken, CRYPTO_REFRESH_SECRET);
                    const refreshPayload = <IJwtPayload>this.verifyToken(decryptedRefreshToken, JWT_REFRESH_SECRET);
                    if (refreshPayload) {
                        if (refreshPayload.userId === accessTokenPayload.userId) {
                            const newAccessToken = this.createAccessToken(refreshPayload.userId);
                            const plainRefreshToken = sign({ userId: refreshPayload.userId }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY_TIME });
                            const encryptedToken = this.encryptByAES(plainRefreshToken, CRYPTO_REFRESH_SECRET).toString();
                            await this.RefreshTokenModel.findByIdAndUpdate(refreshTokenInfo._id, {
                                refreshToken: encryptedToken,
                                expires: new Date(Date.now() + 60 * 60 * 1000),
                                ip: ipAddress,
                                country: 'NP'
                            });
                            return {
                                accessToken: newAccessToken,
                                refreshToken: encryptedToken
                            };
                        } else {
                            throw new UnauthorizedException('Please login to continue.');
                        }
                    }
                } else {
                    throw new UnauthorizedException('Please login to continue.');
                }
            } else {
                throw new UnauthorizedException('Please login to continue.');
            }
        } else {
            throw new UnauthorizedException('Please login to continue.');
        }
    }

    extractTokenFromBearer(req: Request) {
        let token: string;
        const bearerToken = req.header('authorization');
        if (bearerToken) {
            if (bearerToken.startsWith('bearer ')) {
                token = bearerToken.substring(7, bearerToken.length);
            } else {
                throw new UnauthorizedException('User not valid.');
            }
        }
        return token;
    }

    async revokeRefreshToken(req: Request) {
        const encryptedToken = req.cookies.rtknfam;
        const ipAddress = req.ip;
        const accessToken = this.extractTokenFromBearer(req);
        const accessTokenPayload = <IJwtPayload>verify(accessToken, JWT_SECRET, { ignoreExpiration: true });
        if (accessTokenPayload && accessTokenPayload.userId) {
            await this.RefreshTokenModel.findOneAndUpdate(
                { refreshToken: encryptedToken, userId: accessTokenPayload.userId },
                {
                    revoked: new Date(),
                    revokedByIp: ipAddress
                }
            ).exec();
        } else {
            throw new UnauthorizedException('User not valid.');
        }
    }

    buildRefreshToken(req: Request, userId: string, refreshToken: string): IRefreshToken {
        return new this.RefreshTokenModel({
            userId: userId,
            refreshToken: refreshToken,
            ip: req.ip,
            // country: (await axios.get(`http://www.geoplugin.net/json.gp?ip=${req.ip}`)).geoplugin_countryCode,
            country: 'NP',
            expires: new Date(Date.now() + 60 * 60 * 1000),
            browser: 'Chrome',
            revoked: null,
            revokedByIp: null
        });
    }

    encryptByAES(payload: string, secret: string) {
        return CryptoJS.AES.encrypt(payload, secret).toString();
    }

    decryptByAES(encrypted: string, secret: string) {
        return CryptoJS.AES.decrypt(encrypted, secret).toString(CryptoJS.enc.Utf8);
    }

    verifyToken(token: string, secret: string) {
        return verify(token, secret);
    }

    setRefreshTokenCookie(refreshToken: string, res: Response) {
        const cookieOptions = {
            httpOnly: true,
            expires: new Date(Date.now() + 60 * 60 * 1000)
        };
        this.setCookie('rtknfam', refreshToken, cookieOptions, res);
    }

    setCookie(name: string, payload: string, option: any, res: Response) {
        res.cookie(name, payload, option);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    destroyCookie(cookieName: string, res: Response) {
        res.cookie(cookieName, { expires: new Date() });
    }

    // extractJWTFromReq(req: Request) {
    //     let token: string;
    //     const bearerToken = req.header('authorization');
    //     if (bearerToken) {
    //         if (bearerToken.startsWith('bearer ')) {
    //             token = bearerToken.substring(7, bearerToken.length);
    //         } else {
    //             throw new UnauthorizedException('User not valid.');
    //         }
    //     }
    //     const user = this.verifyAccessToken(token);
    //     if(user)
    // }

    // extractJWT() {
    //     return this.extractJWTFromReq;
    // }
}
