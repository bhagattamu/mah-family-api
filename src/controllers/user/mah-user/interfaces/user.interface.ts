import { Document } from 'mongoose';

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
    block?: boolean;
    blockExpires?: Date;
    resetPasswordToken?: string;
    autoPassword?: boolean;
    reCaptchaToken?: string;
}

export interface IUserResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    roles: Array<string>;
}
