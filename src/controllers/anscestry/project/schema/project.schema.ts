import { Schema, Types } from 'mongoose';

export const ProjectSchema = new Schema(
    {
        projectName: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        createdBy: {
            type: Types.ObjectId,
            ref: 'user',
            required: true
        },
        contributors: [
            {
                type: Types.ObjectId,
                ref: 'user'
            }
        ]
    },
    {
        versionKey: false,
        timestamps: true
    }
);
