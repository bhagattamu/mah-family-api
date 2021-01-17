import 'dotenv/config';

export const PORT = Number(process.env.PORT);
export const CLIENT_APP = process.env.CLIENT_APP;
export const MONGO_URI = process.env.MONGO_URI;
export const PAGE_VISIT_LIMIT = Number(process.env.PAGE_VISIT_LIMIT);
export const SIGN_UP_LIMIT = Number(process.env.SIGN_UP_LIMIT);
export const JWT_SECRET = process.env.JWT_SECRET;
export const TOKEN_EXPIRY_TIME = process.env.TOKEN_EXPIRY_TIME;
export const CRYPTR_JWT_SECRET = process.env.CRYPTR_JWT_SECRET;
