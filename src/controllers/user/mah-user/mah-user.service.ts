import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import { NewUserDto } from './dto/new-user.dto';
import { IUser, IUserResponse } from './interfaces/user.interface';

@Injectable()
export class MahUserService {
    constructor(@InjectModel('mah-user') private readonly UserModel: Model<IUser>) {}

    async createUser(newUserDto: NewUserDto) {
        const user = new this.UserModel(newUserDto);
        if (await this.checkEmail(user.email)) {
            throw new BadRequestException(`ALREADY_REGISTERED`);
        }
        this.setVerificationInfo(user);
        const userData = await user.save();
        return this.buildUserRes(userData);
    }

    async checkEmail(email: string): Promise<boolean> {
        const users = await this.UserModel.find({ email: email }).exec();
        return users && users.length;
    }

    setVerificationInfo(user: IUser) {
        user.verification = v4();
    }

    buildUserRes(user: IUser): IUserResponse {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            roles: user.roles
        };
    }
}
