import { Document } from 'mongoose';

export interface IBlock {
    status: boolean;
    count: number;
    blockExpires: Date;
    type: string;
}

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    roles: Array<string>;
    verification: string;
    verified: boolean;
    verificationExpires: Date;
    loginAttempts?: number;
    block?: IBlock;
    isBlock: boolean;
    resetPasswordToken?: string;
    autoPassword?: boolean;
    reCaptchaToken?: string;
    fullName?: string;
    profileImageURL?: string;
}

export interface IUserResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    roles: Array<string>;
    isBlock: boolean;
    autoPassword: boolean;
    fullName?: string;
    profileImageURL: string;
}
