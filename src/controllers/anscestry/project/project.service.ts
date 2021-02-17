import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { IProject } from './interfaces/project.interface';
import { Request } from 'express';

@Injectable()
export class ProjectService {
    constructor(@InjectModel('project') private ProjectModel: Model<IProject>) {}

    async createProject(createProjectDto: CreateProjectDto, req: Request) {
        const project = new this.ProjectModel(createProjectDto);
        project.createdBy = req.user['_id'];
        return await project.save();
    }

    async findProjectById(projectId: string) {
        return await this.ProjectModel.findById(projectId).exec();
    }

    async getAllProjectsAssociatedWithUser(req: Request) {
        const userId = req.user['_id'];
        return await this.ProjectModel.find({ createdBy: userId }).exec();
    }
}
