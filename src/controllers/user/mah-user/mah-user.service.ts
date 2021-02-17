import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import { compare } from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { NewUserDto } from './dto/new-user.dto';
import { IUser, IUserResponse } from './interfaces/user.interface';
import { MAX_LOGIN_ATTEMPT, MAX_LOGIN_BLOCK } from 'src/@core/config';
import { AuthService } from 'src/@core/auth/auth.service';
import { Request, Response } from 'express';

@Injectable()
export class MahUserService {
    constructor(@InjectModel('mah-user') private readonly UserModel: Model<IUser>, private readonly authService: AuthService) {}

    async createUser(newUserDto: NewUserDto) {
        const user = new this.UserModel(newUserDto);
        if (await this.checkEmail(user.email)) {
            throw new BadRequestException(`ALREADY_REGISTERED`);
        }
        this.setVerificationInfo(user);
        user.password = Math.random()
            .toString(36)
            .slice(-8);
        const userData = await user.save();
        return this.buildUserRes(userData);
    }

    async loginUser(loginUseDto: LoginUserDto, req: Request, res: Response) {
        const { email, password } = loginUseDto;
        const user = await this.checkEmail(email);
        if (!user) {
            throw new BadRequestException('EMAIL_NOT_REGISTERED');
        }
        if (await this.isUserVerified(email)) {
            if (!(await this.isUserBlocked(email))) {
                if (user && (await this.checkCredentials(user, password))) {
                    await this.resetPasswordNotMatch(user);
                    try {
                        this.authService.setCookie(await this.authService.createRefreshToken(req, user._id), res);
                    } catch (err) {
                        throw new UnauthorizedException('REFRESH_TOKEN_CREATION_FAILED');
                    }
                    return { ...this.buildUserRes(user), accessToken: this.authService.createAccessToken(user._id) };
                }
            }
        }
    }

    async refreshTokens(accessToken: string, req: Request, res: Response) {
        const { accessToken: newAccessToken, refreshToken } = await this.authService.refreshToken(req, accessToken);
        this.authService.setCookie(refreshToken, res);
        return {
            accessToken: newAccessToken
        };
    }

    async authUserByToken(req: Request) {
        return await this.authService.isAuthenticated(req);
    }

    async logoutUser(req: Request, res: Response) {
        await this.authService.revokeRefreshToken(req);
        this.authService.destroyCookie('rtknfam', res);
        return;
    }

    async checkCredentials(user: any, password: string) {
        const match = await compare(password, user.password);
        if (!match) {
            await this.upPasswordNotMatch(user);
            throw new BadRequestException('PASSWORD_WRONG');
        }
        return match;
    }

    async upPasswordNotMatch(user: any) {
        user.loginAttempts += 1;
        await user.save();
        if (user.loginAttempts > MAX_LOGIN_ATTEMPT) {
            this.blockUser(user, 'TEMP', MAX_LOGIN_BLOCK);
            throw new BadRequestException('USER_BLOCKED');
        }
    }

    async resetPasswordNotMatch(user: any) {
        user.loginAttempts = 0;
        await user.save();
    }

    async blockUser(user: any, type: string, blockTime: number) {
        if (type === 'TEMP') {
            user.blockExpires = new Date().setMinutes(new Date().getMinutes() + blockTime);
        } else if (type === 'FULL') {
            user.block = true;
        }
        await user.save();
    }

    async isUserBlocked(email: string) {
        if (await this.UserModel.findOne({ email: email, block: false, blockExpires: { $exists: true, $lt: new Date() } })) {
            return false;
        } else {
            throw new BadRequestException('USER_BLOCKED');
        }
    }

    async isUserVerified(email: string) {
        if (await this.UserModel.findOne({ email: email, verified: true })) {
            return true;
        } else {
            throw new BadRequestException('NOT_VERIFIED');
        }
    }

    async findUserById(userId: string) {
        return this.UserModel.findById(userId).exec();
    }

    async verifyUser(userId: string) {
        return this.buildUserRes(await this.UserModel.findByIdAndUpdate(userId, { verified: true }).exec());
    }

    async checkEmail(email: string) {
        const user = await this.UserModel.findOne({ email: email }).exec();
        if (user) {
            return user;
        } else {
            return null;
        }
    }

    setVerificationInfo(user: IUser) {
        user.verification = v4();
    }

    buildUserRes(user: IUser): IUserResponse {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            roles: user.roles
        };
    }
}
