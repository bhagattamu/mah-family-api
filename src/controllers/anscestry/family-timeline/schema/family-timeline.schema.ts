import { Schema, Types } from 'mongoose';

export const FamilyTimelineSchema = new Schema({
    subject: {
        type: Types.ObjectId,
        ref: 'subject',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    events: [
        {
            type: Types.ObjectId,
            ref: 'fam-event',
            required: true
        }
    ],
    timelineProject: {
        type: Types.ObjectId,
        ref: 'family-timeline-project',
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'mah-user',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false,
        required: true
    }
});

FamilyTimelineSchema.set('toObject', { virtuals: true });
FamilyTimelineSchema.set('toJSON', { virtuals: true });
FamilyTimelineSchema.virtual('time').get(function() {
    if (new Date(this.timestamp) > new Date()) {
        return 1;
    } else {
        return -1;
    }
});
