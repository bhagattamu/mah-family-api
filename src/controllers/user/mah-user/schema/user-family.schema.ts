import { Schema, Types } from 'mongoose';

export const UserFamilySchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'mah-user',
        unique: true
    },
    familyName: {
        type: String,
        required: true
    },
    subFamilyName: {
        type: String
    },
    language: {
        motherLanguage: {
            type: Types.ObjectId,
            ref: 'language'
        },
        nationalLanguage: {
            type: Types.ObjectId,
            ref: 'language'
        },
        others: [
            {
                type: Types.ObjectId,
                ref: 'language'
            }
        ]
    },
    origin: {
        type: String
    },
    location: {
        longitude: {
            type: Number
        },
        latitude: {
            type: Number
        }
    }
});
