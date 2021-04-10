import { Schema, Types } from 'mongoose';

export const FamilyTimelineProjectSchema = new Schema({
    project: {
        type: Types.ObjectId,
        ref: 'project',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'mah-user',
        required: true
    },
    deleted: {
        type: Boolean,
        default: false,
        required: true
    }
});
