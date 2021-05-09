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
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateBasicInformationDto } from './dto/update-basic-information.dto';
import { IUserFamily, IUserLanguage } from './interfaces/user-family.interface';
import { CreateUserFamilyDto } from './dto/create-user-family.dto';
import { CreateLanguageDto } from 'src/controllers/user/mah-user/dto/create-user-language.dto';
import { LanguageService } from 'src/controllers/anscestry/language/language.service';
import { Messages } from 'src/@core/response/error';

@Injectable()
export class MahUserService {
    constructor(
        @InjectModel('mah-user') private readonly UserModel: Model<IUser>,
        @InjectModel('user-recovery') private readonly UserRecoveryModel: Model<IUserRecovery>,
        @InjectModel('user-family') private readonly UserFamilyModel: Model<IUserFamily>,
        private readonly authService: AuthService,
        private readonly mailService: MailService,
        private readonly languageService: LanguageService
    ) {}

    async createUser(newUserDto: NewUserDto) {
        const user = new this.UserModel(newUserDto);
        if (await this.checkEmail(user.email)) {
            throw new ConflictException(Messages.EMAIL_ALREADY_REGISTERED);
        }
        if (await this.checkPhone(user.phone)) {
            throw new ConflictException(Messages.PHONE_ALREADY_REGISTERED);
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
            throw new BadRequestException(Messages.USER_NOT_REGISTERED);
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
            throw new UnauthorizedException(Messages.REFRESH_TOKEN_CREATION_FAILED);
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
        const auth = await this.authService.isAuthenticated(req);
        if (auth) {
            return { ...this.buildUserRes(req.user) };
        }
        return auth;
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
            throw new NotFoundException(Messages.USERS_NOT_FOUND);
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
                    throw new ForbiddenException(Messages.ROUTE_ACCESS_FORBIDDEN);
                }
            } catch (err) {
                throw new ForbiddenException(Messages.ROUTE_ACCESS_FORBIDDEN);
            }
        } else {
            throw new ForbiddenException(Messages.ROUTE_ACCESS_FORBIDDEN);
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
            throw new NotFoundException(Messages.USER_BLOCKED);
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
            throw new BadRequestException(Messages.INCORRECT_CODE);
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
                    user.autoPassword = false;
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

    async changePassword(changePasswordDto: ChangePasswordDto, req: Request) {
        const user = await this.UserModel.findById(req.user['_id']);
        await this.checkCredentials(user, changePasswordDto.currentPassword);
        user.password = changePasswordDto.password;
        user.autoPassword = false;
        user.loginAttempts = 0;
        return { ...this.buildUserRes(await user.save()) };
    }

    recoveryCodeExpired() {
        throw new ForbiddenException(Messages.RECOVERY_CODE_EXPIRED);
    }

    async checkCredentials(user: any, password: string) {
        const match = await compare(password, user.password);
        if (!match) {
            await this.upPasswordNotMatch(user);
            throw new ForbiddenException(Messages.PASSWORD_INCORRECT);
        }
        return match;
    }

    async upPasswordNotMatch(user: any) {
        user.loginAttempts += 1;
        await user.save();
        if (user.loginAttempts > MAX_LOGIN_ATTEMPT) {
            user.loginAttempts = 0;
            await this.blockUser(user, 'TEMP', MAX_LOGIN_BLOCK);
            throw new ForbiddenException(Messages.USER_BLOCKED);
        }
    }

    async resetPasswordNotMatch(user: any) {
        user.loginAttempts = 0;
        await user.save();
    }

    async blockUser(user: any, type: string, blockTime: number) {
        if (type === 'TEMP') {
            user.block.blockExpires = new Date(new Date().getTime() + blockTime * 60000);
            user.block.type = BlockType.INCORRECT_CREDENTIAL;
        } else if (type === 'FULL') {
            user.block = true;
        }
        await user.save();
    }

    async isUserBlocked(email: string) {
        if (!(await this.UserModel.findOne({ email: email })).isBlock) {
            return false;
        } else {
            throw new ForbiddenException(Messages.USER_BLOCKED);
        }
    }

    async isUserVerified(email: string) {
        if (await this.UserModel.findOne({ email: email, verified: true })) {
            return true;
        } else {
            throw new NotFoundException(Messages.NOT_VERIFIED);
        }
    }

    async findUserById(userId: string) {
        return this.UserModel.findById(userId).exec();
    }

    async verifyUser(userId: string) {
        const user = await this.UserModel.findById(userId);
        const randomPassword = Math.random()
            .toString(36)
            .slice(-8);
        user.password = randomPassword;
        user.verified = true;
        await user.save();
        const userRes = this.buildUserRes(user);
        await this.mailService.sendMail(user.email, 'You have been verified by admin.', 'Account verified', MailType.ACCOUNT_VERIFY, { email: user.email, password: randomPassword, clientAppURL: CLIENT_APP });
        return userRes;
    }

    async checkEmail(email: string) {
        const user = await this.UserModel.findOne({ email: email }).exec();
        if (user) {
            return user;
        } else {
            return null;
        }
    }

    async checkPhone(phone: string) {
        const user = await this.UserModel.findOne({ phone: phone }).exec();
        if (user) {
            return user;
        } else {
            return null;
        }
    }

    setVerificationInfo(user: IUser) {
        user.verification = v4();
    }

    async getAllUsers(req: Request) {
        const query = req.query;
        return await this.UserModel.find({ ...query, roles: { $ne: 'admin' } }).select('firstName lastName email phone roles isBlock');
    }

    async updateBasicInformation(basicInformationDto: UpdateBasicInformationDto, req: Request, userPicture: string) {
        const userId = req.user['_id'];
        await this.UserModel.updateOne({ _id: userId }, { firstName: basicInformationDto.firstName, lastName: basicInformationDto.lastName, profileImageURL: userPicture ? userPicture : req.user['profileImageURL'] });
        return this.buildUserRes(await this.UserModel.findById(userId));
    }

    buildUserRes(user: IUser | any): IUserResponse {
        return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            roles: user.roles,
            isBlock: user.isBlock,
            autoPassword: user.autoPassword,
            profileImageURL: user.profileImageURL
        };
    }

    /**
     * User Family functions
     */

    async createUserFamily(req: Request, createUserFamilyDto: CreateUserFamilyDto) {
        const userId = req.user['_id'];
        const userFamily = await this.UserFamilyModel.findOne({ user: userId });
        if (userFamily) {
            await userFamily.updateOne(createUserFamilyDto);
            return await this.UserFamilyModel.findOne({ user: userId });
        } else {
            createUserFamilyDto['user'] = userId;
            const newUserFamily = new this.UserFamilyModel(createUserFamilyDto);
            return await newUserFamily.save();
        }
    }

    async getUserFamily(req: Request) {
        return await this.UserFamilyModel.findOne({ user: req.user['_id'] }).populate('language.motherLanguage language.nationalLanguage');
    }

    async createUserLanguage(req: Request, createUserLanguage: CreateLanguageDto) {
        const userId = req.user['_id'];
        const userFamily = await this.UserFamilyModel.findOne({ user: userId });
        if (userFamily) {
            const languageDto = await this.buildCreateUserLanguageDto(req, createUserLanguage);
            await userFamily.updateOne({ language: languageDto });
            return await this.UserFamilyModel.findOne({ user: userId });
        } else {
            throw new NotFoundException('FAMILY_NOT_FOUND');
        }
    }

    async buildCreateUserLanguageDto(req: Request, createUserLanguage: CreateLanguageDto): Promise<IUserLanguage> {
        return {
            motherLanguage: await this.getLanguageId(req, createUserLanguage.motherLanguage),
            nationalLanguage: await this.getLanguageId(req, createUserLanguage.nationalLanguage),
            others: []
        };
    }

    async getLanguageId(req: Request, languageName: string): Promise<string> {
        const language = await this.languageService.getLanguageByName(languageName);
        if (language) {
            return language._id;
        } else {
            const newLanguage = await this.languageService.createNewLanguage(req, { languageName: languageName, languageDescription: '', origin: { location: { longitude: 0, latitude: 0, Address: '' }, description: '' } });
            return newLanguage._id;
        }
    }
}
