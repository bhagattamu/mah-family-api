import { Schema } from 'mongoose';

export const FamilyEventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    emotionType: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    images: [
        {
            location: {
                type: String
            },
            position: {
                type: Number,
                default: 1
            },
            description: {
                type: String
            }
        }
    ],
    deleted: {
        type: Boolean,
        default: false,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
});
