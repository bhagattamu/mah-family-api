import 'dotenv/config';

export const PORT = Number(process.env.PORT);
export const CLIENT_APP = process.env.CLIENT_APP;
export const MONGO_URI = process.env.MONGO_URI;
export const PAGE_VISIT_LIMIT = Number(process.env.PAGE_VISIT_LIMIT);
export const SIGN_UP_LIMIT = Number(process.env.SIGN_UP_LIMIT);
export const JWT_SECRET = process.env.JWT_SECRET;
export const TOKEN_EXPIRY_TIME = process.env.TOKEN_EXPIRY_TIME;
export const CRYPTO_REFRESH_SECRET = process.env.CRYPTO_REFRESH_SECRET;
export const MAX_LOGIN_ATTEMPT = Number(process.env.MAX_LOGIN_ATTEMPT);
export const MAX_LOGIN_BLOCK = Number(process.env.MAX_LOGIN_BLOCK);
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const REFRESH_TOKEN_EXPIRY_TIME = process.env.REFRESH_TOKEN_EXPIRY_TIME;
export const GENDER = [
    {
        sGender: 'M',
        lGender: 'Male',
        pronoun: ['him']
    },
    {
        sGender: 'F',
        lGender: 'Female',
        pronoun: ['her']
    },
    {
        sGender: 'C',
        lGender: 'Custom',
        pronoun: ['him', 'her', 'them']
    }
];
