import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { CreateFamilyEventDto } from './dto/create-family-event.dto';
import { CreateFamilyTimelineProjectDto } from './dto/create-family-timeline-project.dto';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateFamilyEventDto } from './dto/update-family-event.dto';
import { UpdateFamilyTimelineProjectDto } from './dto/update-family-timeline-project.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { IFamEvent, IFamEventWithDoc } from './interfaces/fam-event.interface';
import { IFamilyTimelineProjectWithDoc } from './interfaces/family-timeline-project.interface';
import { IFamilyTimeline, IFamilyTimelineWithDoc } from './interfaces/family-timeline.interface';

@Injectable()
export class FamilyTimelineService {
    constructor(
        @InjectModel('family-timeline-project') private FamilyTimelineProjectModel: Model<IFamilyTimelineProjectWithDoc>,
        @InjectModel('fam-event') private FamilyEventModel: Model<IFamEventWithDoc>,
        @InjectModel('family-timeline') private FamilyTimelineModel: Model<IFamilyTimelineWithDoc>
    ) {}

    async createFamilyTimelineProject(req: Request, createFamilyTimelineProjectDto: CreateFamilyTimelineProjectDto) {
        createFamilyTimelineProjectDto['createdBy'] = req.user['_id'];
        return await (await new this.FamilyTimelineProjectModel(createFamilyTimelineProjectDto).save()).populate('createdBy', 'firstName lastName').execPopulate();
    }

    async getAllTimelineProject(projectId: string) {
        return await this.FamilyTimelineProjectModel.find({ project: projectId, deleted: false }).populate('createdBy', 'firstName lastName');
    }

    async getTimelineProjectDetail(timelineProjectId: string) {
        const timelineProjectDetail = await this.FamilyTimelineProjectModel.findOne({ _id: timelineProjectId, deleted: false });
        return {
            ...timelineProjectDetail['_doc'],
            timelines: await this.getAllTimelinePointOfProject(timelineProjectDetail._id)
        };
    }

    async updateTimelineProject(timelineProjectId: string, updateFamilyTimelineProjectDto: UpdateFamilyTimelineProjectDto) {
        return await this.FamilyTimelineProjectModel.updateOne({ _id: timelineProjectId }, updateFamilyTimelineProjectDto);
    }

    async createFamilyTimelinePoint(req: Request, createTimelineDto: CreateTimelineDto) {
        createTimelineDto['events'] = await this.createFamilyEventsFromTimelineDto(createTimelineDto);
        createTimelineDto['createdBy'] = req.user['_id'];
        return await new this.FamilyTimelineModel(createTimelineDto).save();
    }

    async createFamilyEventsFromTimelineDto(createFamilyTimelineDto: CreateTimelineDto): Promise<Array<string>> {
        return await Promise.all(
            createFamilyTimelineDto.eventDatas.map(async event => {
                const savedEvent = await this.createFamilyEvent(event);
                return savedEvent._id;
            })
        );
    }

    async createFamilyEvent(createFamilyEventDto: CreateFamilyEventDto) {
        return await new this.FamilyEventModel(createFamilyEventDto).save();
    }

    async updateFamilyEventsFromTimelineDto(timelineId: string, updateFamilyTimelineDto: UpdateTimelineDto): Promise<Array<string>> {
        // first delete not found Events
        const timeline = await this.FamilyTimelineModel.findById(timelineId);
        const newUpdatedEvents = updateFamilyTimelineDto.eventDatas.filter(eventData => eventData.eventId).map(eventData => <string>eventData.eventId);
        const prevTimelineEvents = <Array<string>>timeline.events;
        const deletingEvents = prevTimelineEvents.filter(event => !newUpdatedEvents.some(element => element === event.toString()));
        await this.FamilyEventModel.deleteMany({ _id: { $in: deletingEvents } });
        return await Promise.all(
            updateFamilyTimelineDto.eventDatas.map(async event => {
                if (!event.eventId) {
                    const newEvent = await new this.FamilyEventModel(event).save();
                    return newEvent._id;
                }
                await this.updateFamilyEvent(event.eventId, event);
                return event.eventId;
            })
        );
    }

    async updateFamilyEvent(eventId: string, updateFamilyEventDto: UpdateFamilyEventDto) {
        return await this.FamilyEventModel.updateOne({ _id: eventId }, updateFamilyEventDto);
    }

    async getAllTimelinePointOfProject(timelineProjectId: string) {
        return await this.FamilyTimelineModel.find({ timelineProject: timelineProjectId, deleted: false })
            .sort({ timestamp: -1 })
            .populate('events subject');
    }

    async getTimelinePointById(timelineProjectId: string, pointId: string) {
        return await this.FamilyTimelineModel.findOne({ _id: pointId, timelineProject: timelineProjectId, deleted: false }).populate('event subject');
    }

    async updateTimelinePointById(req: Request, pointId: string, updateTimelineDto: UpdateTimelineDto) {
        const timelineProjectId = req.query.timelineProjectId.toString();
        const timelinePoint = await this.FamilyTimelineModel.findOne({ _id: pointId, timelineProject: timelineProjectId, deleted: false });
        if (timelinePoint) {
            try {
                const updatedEvents = await this.updateFamilyEventsFromTimelineDto(pointId, updateTimelineDto);
                await this.FamilyTimelineModel.updateOne(
                    { _id: pointId, timelineProject: timelineProjectId },
                    {
                        events: updatedEvents,
                        subject: updateTimelineDto.subject
                    }
                );
            } catch (err) {
                throw new BadRequestException('UPDATE_TIMELINE_POINT_FAILED');
            }
        } else {
            throw new NotFoundException('TIMELINE_POINT_NOT_FOUND');
        }
    }

    async deleteTimelinePointById(timelineProjectId: string, pointId: string) {
        const timelinePoint = await this.FamilyTimelineModel.findOne({ _id: pointId, timelineProject: timelineProjectId });
        await this.FamilyEventModel.updateMany({ _id: { $in: timelinePoint.events } }, { deleted: true });
        return await this.FamilyTimelineModel.updateOne({ _id: pointId, timelineProject: timelineProjectId }, { deleted: true });
    }

    async deleteTimelinePointsByProject(timelineProjectId: string) {
        const timelinePoints = await this.FamilyTimelineModel.find({ timelineProject: timelineProjectId });
        for (let timelinePoint of timelinePoints) {
            await this.FamilyEventModel.updateMany({ _id: { $in: timelinePoint.events } }, { deleted: true });
            timelinePoint.deleted = true;
            await timelinePoint.save();
        }
    }
}
