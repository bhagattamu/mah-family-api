import { Document } from 'mongoose';

export interface IUserLanguage {
    motherLanguage: string;
    nationalLanguage: string;
    others?: Array<string>;
}

export interface IUserLocation {
    longitude: number;
    latitude: number;
}

export interface IUserFamily extends Document {
    user: string;
    familyName: string;
    subFamilyName?: string;
    language: IUserLanguage;
    origin: string;
    location: IUserLocation;
}
