import { Schema, Types } from 'mongoose';

export const UserLanguageSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'user',
        unique: true
    },
    forkedLanguages: [
        {
            language: {
                type: Types.ObjectId,
                ref: 'language'
            },
            forkedDate: {
                type: Date
            },
            status: {
                type: Boolean,
                default: true
            },
            block: {
                type: Boolean,
                default: false
            }
        }
    ]
});
