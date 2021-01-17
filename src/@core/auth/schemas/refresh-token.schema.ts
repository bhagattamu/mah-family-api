import { Schema } from 'mongoose';

export const RefreshTokenSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'mah-user',
            required: true
        },
        refreshToken: {
            type: String,
            required: true
        },
        ip: {
            type: String,
            required: true
        },
        browser: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        valid: {
            type: Boolean,
            default: true,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);
