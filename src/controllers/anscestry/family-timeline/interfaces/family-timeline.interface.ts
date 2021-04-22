import { Document } from 'mongoose';
import { IFamEvent } from './fam-event.interface';

export interface IFamilyTimelineWithDoc extends Document {
    title: string;
    timelineProject: string;
    subject: string;
    events: Array<string> | Array<IFamEvent>;
    createdBy?: string;
    date: Date;
    deleted?: boolean;
}

export interface IFamilyTimeline {
    title: string;
    timelineProject: string;
    subject: string;
    events: Array<string> | Array<IFamEvent>;
    createdBy?: string;
    date: Date;
    deleted?: boolean;
}
