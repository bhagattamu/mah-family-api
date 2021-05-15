import { Schema, Types } from 'mongoose';

export const SubjectSchema = new Schema(
    {
        createdBy: {
            type: Types.ObjectId,
            ref: 'user',
            required: true
        },
        projectId: {
            type: Types.ObjectId,
            ref: 'project',
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String
        },
        gender: {
            type: String,
            required: true
        },
        imageURL: {
            type: String,
            default: ''
        },
        familyName: {
            main: {
                type: Types.ObjectId,
                ref: 'family-name'
            },
            sub: {
                type: Types.ObjectId,
                ref: 'family-sub-group'
            }
        },
        country: {
            type: String
        },
        address: {
            type: String
        },
        isLiving: {
            type: Boolean,
            default: true
        },
        dateOfBirth: {
            type: Date
        },
        dateOfDeath: {
            type: Date
        },
        marriages: [
            {
                spouse: {
                    type: Types.ObjectId,
                    ref: 'subject'
                },
                spousePosition: {
                    type: Number,
                    default: 1
                },
                childrens: [
                    {
                        children: {
                            type: Types.ObjectId,
                            ref: 'subject'
                        },
                        childPosition: {
                            type: Number,
                            default: 1
                        }
                    }
                ]
            }
        ]
    },
    {
        versionKey: false,
        timestamps: true
    }
);

SubjectSchema.set('toObject', { virtuals: true });
SubjectSchema.set('toJSON', { virtuals: true });

SubjectSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});
