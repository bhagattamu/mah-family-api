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
        pinned: {
            type: Boolean,
            default: false,
            required: true
        },
        createdBy: {
            type: Types.ObjectId,
            ref: 'user',
            required: true
        },
        contributors: [
            {
                contributor: {
                    type: Types.ObjectId,
                    required: true,
                    ref: 'user'
                },
                pinned: {
                    type: Boolean,
                    default: false
                },
                block: {
                    type: Boolean,
                    default: false
                }
            }
        ]
    },
    {
        versionKey: false,
        timestamps: true
    }
);
