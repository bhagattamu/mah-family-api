import { Document } from 'mongoose';

interface IBlock {
    status: boolean;
    count: number;
    type: string;
    blockExpires: Date;
}
export interface IUser extends Document {
    _id: string;
    block: IBlock;
    roles: Array<string>;
    verified: boolean;
    loginAttempts: number;
    resetPasswordToken?: string;
    autoPassword: boolean;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    verificationExpires: Date;
    verification: string;
    password: string;
}
