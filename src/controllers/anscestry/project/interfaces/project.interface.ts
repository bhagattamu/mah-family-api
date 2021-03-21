import { Document } from 'mongoose';

export interface IProject extends Document {
    projectName: string;
    createdBy: string;
    pinned: boolean;
    contributors?: Array<string>;
}
