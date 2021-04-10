import { Document } from 'mongoose';
import { IFamEvent } from './fam-event.interface';

export interface IFamilyTimelineWithDoc extends Document {
    timelineProject: string;
    subject: string;
    events: Array<string> | Array<IFamEvent>;
    createdBy?: string;
    timestamp: Date;
    deleted?: boolean;
}

export interface IFamilyTimeline {
    timelineProject: string;
    subject: string;
    events: Array<string> | Array<IFamEvent>;
    createdBy?: string;
    timestamp: Date;
    deleted?: boolean;
}
