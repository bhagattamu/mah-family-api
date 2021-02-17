import { Schema } from 'mongoose';

export const FamilySubGroup = new Schema({
    subGroupName: {
        type: String,
        unique: true
    },
    description: {
        type: String
    }
});
