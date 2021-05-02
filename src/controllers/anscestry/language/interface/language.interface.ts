import { Document } from 'mongoose';

export interface IOrigin {
    location: {
        longitude: number;
        latitude: number;
        address: string;
    };
    description: string;
}

export interface ILanguage extends Document {
    languageName: string;
    languageDescription?: string;
    origin?: IOrigin;
    createdBy: string;
    supervisors?: Array<string>;
    status: boolean;
}

export interface IForkedLanguage {
    language: string;
    forkedDate: Date;
    status: boolean;
    block: boolean;
}

export interface IUserLanguage extends Document {
    user: string;
    forkedLanguages: Array<IForkedLanguage>;
}
