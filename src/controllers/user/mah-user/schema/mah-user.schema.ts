import { HookNextFunction, Schema } from 'mongoose';
import { hash } from 'bcrypt';

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
            type: Boolean,
            default: false
        },
        blockExpires: {
            type: Date,
            default: Date.now
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

MahUserSchema.pre('save', async function(next: HookNextFunction) {
    try {
        if (this.isModified('password')) {
            this['password'] = await hash(this['password'], 10);
            return next();
        }
        return next();
    } catch (err) {
        return next(err);
    }
});
