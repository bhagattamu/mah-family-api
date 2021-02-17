import { Schema, Types } from 'mongoose';

export const FamilyNameSchema = new Schema({
    familyName: {
        type: String,
        unique: true
    },
    motherLanguage: {
        type: Types.ObjectId,
        ref: 'language'
    },
    nationalLanguage: {
        type: Types.ObjectId,
        ref: 'language'
    },
    origin: {
        type: String
    },
    country: {
        type: String
    },
    subGroups: [
        {
            type: Types.ObjectId,
            ref: 'family-sub-group'
        }
    ]
});
