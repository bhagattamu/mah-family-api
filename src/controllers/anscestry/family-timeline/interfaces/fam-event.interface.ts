import { Document } from 'mongoose';

export interface IImage {
    location: string;
    position: number;
    description: string;
}

export interface IFamEvent {
    title: string;
    type?: string;
    description?: string;
    timestamp: Date;
    emotiontype?: string;
    images: Array<IImage>;
    deleted: boolean;
}

export interface IFamEventWithDoc extends Document {
    title: string;
    type?: string;
    description?: string;
    timestamp: Date;
    emotiontype?: string;
    images: Array<IImage>;
}
