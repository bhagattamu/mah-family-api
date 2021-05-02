import { Types } from 'mongoose';

export const adminUser = {
    _id: Types.ObjectId('607172fd8c1d4c0b5c65a71a'),
    block: {
        status: false,
        count: 0,
        type: 'NO',
        blockExpires: new Date()
    },
    roles: ['admin', 'user'],
    verified: true,
    loginAttempts: 0,
    resetPasswordToken: '',
    autoPassword: false,
    firstName: 'Bhagat',
    lastName: 'Gurung',
    email: 'bhagattamu@gmail.com',
    phone: '9819122180',
    verificationExpires: new Date(),
    verification: 'a9401e93-8963-4c78-84cc-e49433936315',
    password: 'P@$$w0rd123',
    createdAt: new Date(),
    updatedAt: new Date()
};
