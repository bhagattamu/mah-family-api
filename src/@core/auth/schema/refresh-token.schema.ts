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
        expires: {
            type: Date,
            required: true
        },
        revoked: {
            type: Date
        },
        revokedByIp: {
            type: String
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
        }
    },
    {
        toJSON: { virtuals: true },
        versionKey: false,
        timestamps: true
    }
);
RefreshTokenSchema.virtual('isExpired').get(function() {
    return Date.now() >= this.expires;
});

RefreshTokenSchema.virtual('isActive').get(function() {
    return !this.revoked && !this.isExpired;
});
