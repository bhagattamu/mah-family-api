import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import { compare } from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { NewUserDto } from './dto/new-user.dto';
import { IUser, IUserResponse } from './interfaces/user.interface';
import { CLIENT_APP, CRYPTO_RESET_PASSWORD_SECRET, JWT_RESET_PASSWORD_SECRET, MAX_LOGIN_ATTEMPT, MAX_LOGIN_BLOCK } from 'src/@core/config';
import { AuthService } from 'src/@core/auth/auth.service';
import { Request, Response } from 'express';
import { MailService } from 'src/controllers/utils/mail/mail.service';
import { MailType } from 'src/@core/config/mail.enum';
import { BlockType } from 'src/@core/config/block.enum';
import { IUserRecovery } from './interfaces/user-recovery.interface';
import { ChangePasswordByCodeDto } from './dto/change-password-recovery-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class MahUserService {
    constructor(@InjectModel('mah-user') private readonly UserModel: Model<IUser>, @InjectModel('user-recovery') private readonly UserRecoveryModel: Model<IUserRecovery>, private readonly authService: AuthService, private mailService: MailService) {}

    async createUser(newUserDto: NewUserDto) {
        const user = new this.UserModel(newUserDto);
        if (await this.checkEmail(user.email)) {
            throw new ConflictException(`ALREADY_REGISTERED`);
        }
        this.setVerificationInfo(user);
        user.password = Math.random()
            .toString(36)
            .slice(-8);
        const userData = await user.save();
        return this.buildUserRes(userData);
    }

    async authUser(loginUseDto: LoginUserDto, req: Request, res: Response) {
        const { email, password } = loginUseDto;
        const user = await this.checkEmail(email);
        if (!user) {
            throw new BadRequestException('EMAIL_NOT_REGISTERED');
        }
        if (await this.isUserVerified(email)) {
            if (!(await this.isUserBlocked(email))) {
                if (user && (await this.checkCredentials(user, password))) {
                    await this.resetPasswordNotMatch(user);
                    return await this.loginUser(req, res, user);
                }
            }
        }
    }

    async loginUser(req: Request, res: Response, user: IUser) {
        try {
            this.authService.setRefreshTokenCookie(await this.authService.createRefreshToken(req, user._id), res);
        } catch (err) {
            throw new UnauthorizedException('REFRESH_TOKEN_CREATION_FAILED');
        }
        return { ...this.buildUserRes(user), accessToken: this.authService.createAccessToken(user._id) };
    }

    async refreshTokens(accessToken: string, req: Request, res: Response) {
        const { accessToken: newAccessToken, refreshToken } = await this.authService.refreshToken(req, accessToken);
        this.authService.setRefreshTokenCookie(refreshToken, res);
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

    async findUserByEmailOrPhone(query: string) {
        const user = await this.UserModel.findOne({ $or: [{ email: query }, { phone: query }] });
        if (user && user.verified) {
            return user;
        } else {
            throw new NotFoundException('USER_NOT_FOUND');
        }
    }

    async checkValidRecoveryCodeRoute(req: Request, userId: string) {
        const recoveryToken = req.cookies.recoverytkn;
        if (recoveryToken) {
            const mateCode = this.getMateCode(recoveryToken);
            try {
                const recoveryData = await this.UserRecoveryModel.findOne({ user: userId, mateCode: mateCode });
                if (recoveryData && !recoveryData.used) {
                    return {
                        valid: true
                    };
                } else {
                    this.recoveryCodeExpired();
                }
            } catch (err) {
                this.recoveryCodeExpired();
            }
        } else {
            this.recoveryCodeExpired();
        }
    }

    async checkRecoveryTokenValidity(userId: string, key: string) {
        const recoveryData = await this.UserRecoveryModel.findOne({ user: userId, key: key, used: false });
        if (recoveryData) {
            const recoveryToken = this.authService.decryptByAES(recoveryData.token, CRYPTO_RESET_PASSWORD_SECRET);
            try {
                const decoded = this.authService.verifyToken(recoveryToken, JWT_RESET_PASSWORD_SECRET);
                if (decoded) {
                    return {
                        valid: true
                    };
                } else {
                    throw new ForbiddenException('FORBIDDEN_ROUTE');
                }
            } catch (err) {
                throw new ForbiddenException('FORBIDDEN_ROUTE');
            }
        } else {
            throw new ForbiddenException('FORBIDDEN_ROUTE');
        }
    }

    async reSendResetPasswordCodeAndLink(userId: string, res: Response) {
        const user = await this.UserModel.findById(userId).select('email');
        await this.UserRecoveryModel.updateMany({ user: userId, used: false }, { used: true });
        return await this.sendResetPasswordCodeAndLink(user.email, res);
    }

    async sendResetPasswordCodeAndLink(query: string, res: Response) {
        const user = await this.findUserByEmailOrPhone(query);
        if (user.isBlock && user.block.type === BlockType.COMPLETE_BLOCK) {
            throw new NotFoundException('USER_NOT_FOUND');
        } else {
            const randomCode = Math.random()
                .toString(36)
                .slice(-8);
            const mateCode = Math.random()
                .toString(36)
                .slice(-8);
            const resetPasswordToken = this.authService.createResetPasswordToken(user.email);
            const encryptedToken = this.authService.encryptByAES(resetPasswordToken, CRYPTO_RESET_PASSWORD_SECRET);
            const key = v4();
            const recoveryLink = `${CLIENT_APP}/auth/recovery/password?u=${user.id}&rt=${key}`;
            const userRecovery = new this.UserRecoveryModel({
                user: user.id,
                recoveryCode: randomCode,
                mateCode: mateCode,
                key: key,
                token: encryptedToken
            });
            await userRecovery.save();
            const mateSecret = 'mate-secret-asfasfhaksjf';
            this.authService.setCookie('recoverytkn', this.authService.encryptByAES(mateCode, mateSecret), { httpOnly: true, expires: new Date(Date.now() + 10 * 60 * 1000) }, res);
            await this.mailService.sendMail(user.email, `${randomCode} is your account recovery code`, 'Account recovery', MailType.ACCOUNT_RECOVERY, { email: user.email, recoveryLink, randomCode });
            return {
                id: user._id,
                email: user.email
            };
        }
    }

    getMateCode(mateEncrypted: string) {
        try {
            const mateSecret = 'mate-secret-asfasfhaksjf';
            const mateCode = this.authService.decryptByAES(mateEncrypted, mateSecret);
            return mateCode;
        } catch (err) {
            this.recoveryCodeExpired();
        }
    }

    async changePasswordByCode(changePasswordByCodeDto: ChangePasswordByCodeDto, req: Request) {
        const recoveryToken = req.cookies.recoverytkn;
        if (recoveryToken) {
            const mateCode = this.getMateCode(recoveryToken);
            const recoveryData = await this.UserRecoveryModel.findOne({ user: changePasswordByCodeDto.user, recoveryCode: changePasswordByCodeDto.recoveryCode, mateCode: mateCode });
            if (recoveryData && !recoveryData.used) {
                return {
                    resetUrl: `/auth/recovery/password?u=${recoveryData.user}&rt=${recoveryData.key}`
                };
            } else {
                this.recoveryCodeExpired();
            }
        } else {
            this.recoveryCodeExpired();
        }
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto, req: Request, res: Response) {
        const recoveryData = await this.UserRecoveryModel.findOne({ user: resetPasswordDto.user, key: resetPasswordDto.key, used: false });
        if (recoveryData) {
            recoveryData.used = true;
            await recoveryData.save();
            const recoveryToken = this.authService.decryptByAES(recoveryData.token, CRYPTO_RESET_PASSWORD_SECRET);
            try {
                const decoded = this.authService.verifyToken(recoveryToken, JWT_RESET_PASSWORD_SECRET);
                if (decoded) {
                    const user = await this.UserModel.findOne({ _id: resetPasswordDto.user });
                    user.password = resetPasswordDto.password;
                    user.loginAttempts = 0;
                    await user.save();
                    return await this.loginUser(req, res, user);
                }
            } catch (err) {
                this.recoveryCodeExpired();
            }
        } else {
            this.recoveryCodeExpired();
        }
    }

    recoveryCodeExpired() {
        throw new ForbiddenException('RECOVERY_CODE_EXPIRED');
    }

    async checkCredentials(user: any, password: string) {
        const match = await compare(password, user.password);
        if (!match) {
            await this.upPasswordNotMatch(user);
            throw new ForbiddenException('PASSWORD_WRONG');
        }
        return match;
    }

    async upPasswordNotMatch(user: any) {
        user.loginAttempts += 1;
        await user.save();
        if (user.loginAttempts > MAX_LOGIN_ATTEMPT) {
            this.blockUser(user, 'TEMP', MAX_LOGIN_BLOCK);
            throw new ForbiddenException('USER_BLOCKED');
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
        if (!(await this.UserModel.findOne({ email: email })).isBlock) {
            return false;
        } else {
            throw new ForbiddenException('USER_BLOCKED');
        }
    }

    async isUserVerified(email: string) {
        if (await this.UserModel.findOne({ email: email, verified: true })) {
            return true;
        } else {
            throw new NotFoundException('NOT_VERIFIED');
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
            roles: user.roles,
            isBlock: user.isBlock
        };
    }
}
