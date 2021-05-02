import { Schema, Types } from 'mongoose';

export const LanguageSchema = new Schema({
    languageName: {
        type: String,
        unique: true
    },
    languageDescription: {
        type: String
    },
    origin: {
        location: {
            longitude: {
                type: Number
            },
            latitude: {
                type: Number
            },
            address: {
                type: String
            }
        },
        description: {
            type: String
        }
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'user'
    },
    status: {
        type: Boolean,
        default: false
    },
    supervisors: [
        {
            type: Types.ObjectId,
            ref: 'user'
        }
    ]
});
