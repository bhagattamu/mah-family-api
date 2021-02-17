import { Document } from 'mongoose';

export interface IRefreshToken extends Document {
    userId: string;
    refreshToken: string;
    ip: string;
    browser: string;
    country: string;
    expires: Date;
    revoked: Date;
    revokedByIp: string;
    isExpired?: boolean;
    isActive?: boolean;
}
