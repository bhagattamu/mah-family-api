import { Document } from 'mongoose';

export interface ISubject extends Document {
    projectId: string;
    firstName: string;
    lastName: string;
    gender: string;
    familyName?: any;
    imageURL: string;
    country?: string;
    address?: string;
    dateOfBirth?: Date;
    dateOfDeath?: Date;
    marriages?: [
        {
            spouse: any;
            spousePosition: number;
            childrens: [];
        }
    ];
    createdBy: string;
}
