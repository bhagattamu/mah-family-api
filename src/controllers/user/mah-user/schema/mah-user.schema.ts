import { HookNextFunction, Schema } from 'mongoose';
import { hash } from 'bcrypt';
import { BlockType } from 'src/@core/config/block.enum';

export const MahUserSchema = new Schema(
    {
        firstName: {
            type: String,
            minlength: 2,
            maxlength: 50,
            required: true
        },
        lastName: {
            type: String,
            minlength: 2,
            maxlength: 50,
            required: true
        },
        email: {
            type: String,
            min: 5,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        roles: {
            type: [String],
            default: ['user']
        },
        profileImageURL: {
            type: String
        },
        verification: {
            type: String
        },
        verified: {
            type: Boolean,
            default: false
        },
        verificationExpires: {
            type: Date,
            default: Date.now
        },
        loginAttempts: {
            type: Number,
            default: 0
        },
        block: {
            status: {
                type: Boolean,
                default: false
            },
            count: {
                type: Number,
                default: 0
            },
            type: {
                type: String,
                default: BlockType.NO
            },
            blockExpires: {
                type: Date,
                default: Date.now
            }
        },
        resetPasswordToken: {
            type: String,
            default: ''
        },
        autoPassword: {
            type: Boolean,
            default: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

MahUserSchema.set('toObject', { virtuals: true });
MahUserSchema.set('toJSON', { virtuals: true });
MahUserSchema.virtual('isBlock').get(function() {
    if (this.block.status || new Date(this.block.blockExpires) > new Date() || this.block.type === BlockType.COMPLETE_BLOCK) {
        return true;
    } else {
        return false;
    }
});

MahUserSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

MahUserSchema.pre('save', async function(next: HookNextFunction) {
    try {
        if (this.isModified('password')) {
            this['password'] = await hash(this['password'], 10);
        }
        return next();
    } catch (err) {
        return next(err);
    }
});
