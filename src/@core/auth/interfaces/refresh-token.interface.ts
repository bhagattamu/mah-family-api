export interface IRefreshToken {
    userId: string;
    refreshToken: string;
    ip: string;
    browser: string;
    country: string;
    valid: boolean;
}
