import { Document } from 'mongoose';

export interface IFamilyTimelineProjectWithDoc extends Document {
    project: string;
    title: string;
    deleted?: boolean;
}

export interface IFamilyTimelineProject {
    project: string;
    title: string;
    deleted?: boolean;
}
