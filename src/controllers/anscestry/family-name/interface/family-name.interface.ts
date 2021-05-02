import { Document } from 'mongoose';

export interface IFamilyName extends Document {
    familyName: string;
    motherLanguage: string;
    nationalLanguage: string;
    origin: string;
    country: string;
    subGroups: Array<string>;
}

export interface IFamilySubGroup extends Document {
    subGroupName: string;
    description: string;
}
