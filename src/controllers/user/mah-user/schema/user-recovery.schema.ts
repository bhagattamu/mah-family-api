import { Schema, Types } from 'mongoose';

export const UserRecoverySchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'mah-user',
        required: true
    },
    recoveryCode: {
        type: String,
        required: true
    },
    mateCode: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    used: {
        type: Boolean,
        required: true,
        default: false
    }
});
