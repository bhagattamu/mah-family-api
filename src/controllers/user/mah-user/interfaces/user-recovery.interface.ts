import { Document } from 'mongoose';
import { IUser } from './user.interface';

export interface IUserRecovery extends Document {
    user: string | IUser;
    recoveryCode: string;
    mateCode: string;
    key: string;
    token: string;
    used: boolean;
}
