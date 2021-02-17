import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model, Types } from 'mongoose';
import { CreateChildSubjectDto } from './dto/create-child-subject.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { ISubject } from './interfaces/subject.interface';

@Injectable()
export class SubjectService {
    constructor(@InjectModel('subject') private SubjectModel: Model<ISubject>) {}

    async createSubject(createSubjectDto: CreateSubjectDto, req: Request, userPicture: string) {
        const subject = new this.SubjectModel(createSubjectDto);
        const userId = req.user['_id'];
        subject.createdBy = userId;
        subject.imageURL = userPicture;
        return await subject.save();
    }

    async createSpouseForSubject(createSubjectDto: CreateSubjectDto, mateId: string, req: Request, userPicture: string) {
        const mateObj = await this.SubjectModel.findById(mateId).exec();
        if (!mateObj) {
            throw new Error('Main subject not found');
        }
        const newSpouse = new this.SubjectModel(createSubjectDto);
        const user = this.getUserFromReq(req);
        newSpouse.createdBy = user['_id'];
        newSpouse.imageURL = userPicture;
        newSpouse.marriages = [
            {
                spouse: mateId,
                spousePosition: 1,
                childrens: []
            }
        ];
        const createdSpouse = await (await newSpouse.save()).populate({ path: 'marriages.spouse' }).execPopulate();
        if (mateObj?.marriages && mateObj?.marriages?.length) {
            mateObj.marriages.push({
                spouse: createdSpouse._id,
                spousePosition: mateObj.marriages.length + 1,
                childrens: []
            });
        } else {
            mateObj.marriages = [
                {
                    spouse: createdSpouse._id,
                    spousePosition: 1,
                    childrens: []
                }
            ];
        }
        const mainSubject = await (await mateObj.save()).populate({ path: 'marriages.spouse' }).execPopulate();
        return {
            mainSubject: mainSubject,
            spouse: createdSpouse
        };
    }

    async createChildForSubject(createChildSubjectDto: CreateChildSubjectDto, firstParent: string, req: Request, userPicture: string) {
        const firstParentObj = await this.SubjectModel.findById(firstParent).exec();
        const secondParentObj = await this.SubjectModel.findById(createChildSubjectDto.parent).exec();
        if (!firstParentObj || !secondParentObj) {
            throw new Error('Mother or father is missing.');
        }
        const child = new this.SubjectModel(createChildSubjectDto);
        const user = this.getUserFromReq(req);
        child.createdBy = user['_id'];
        child.imageURL = userPicture;
        const newChild = await child.save();
        await this.SubjectModel.updateOne(
            { _id: firstParent, 'marriages.spouse': createChildSubjectDto.parent },
            {
                $push: {
                    'marriages.$.childrens': { children: Types.ObjectId(newChild._id) }
                }
            }
        );
        await this.SubjectModel.updateOne(
            { _id: createChildSubjectDto.parent, 'marriages.spouse': firstParent },
            {
                $push: {
                    'marriages.$.childrens': { children: Types.ObjectId(newChild._id) }
                }
            }
        );
        return {
            mainParent: await this.SubjectModel.findById(firstParent).populate({ path: 'marriages.spouse' }),
            anotherParent: await this.SubjectModel.findById(createChildSubjectDto.parent).populate({ path: 'marriages.spouse' }),
            child: newChild
        };
    }

    async getSubjectById(subjectId: string, req: Request) {
        return await this.SubjectModel.findOne({ _id: subjectId, createdBy: req.user['_id'] })
            .populate({ path: 'marriages.spouse' })
            .exec();
    }

    async getAllSubjectOfProjectId(projectId: string, req: Request) {
        const allSubjects = await this.SubjectModel.find({ projectId: projectId, createdBy: req.user['_id'] })
            .populate({ path: 'marriages.spouse' })
            .exec();
        return allSubjects;
        // let subjectIds = [];
        // return allSubjects.filter(subject => {
        //     if (subjectIds.includes(String(subject._id))) {
        //         return false;
        //     } else {
        //         subjectIds.push(subject._id);
        //         if (subject?.marriages && subject?.marriages?.length) {
        //             subject?.marriages?.forEach((marriage: any) => {
        //                 subjectIds.push(String(marriage.spouse._id));
        //             });
        //         }
        //         return true;
        //     }
        // });
    }

    async getTreeData(rootId: string) {
        return await this.SubjectModel.find().exec();
        // let treeData = [];
        // const rootData = await this.SubjectModel.findById(rootId).populate({
        //     path: 'marriages.spouse marriages.childrens.children',
        //     populate: {
        //         path: 'children'
        //     }
        // });
        // const stageChildrens = rootData.marriages.map(marriage => marriage.childrens);
        // let childrens = [];

        // stageChildrens.forEach(childs => {
        //     childs.forEach((child: any) => childrens.push(child.children));
        // });
        // treeData = [...rootData.marriages.map(marriage => marriage.spouse), ...childrens];
        // treeData = [await this.SubjectModel.findById(rootId), ...treeData];
        // return treeData;
    }

    getUserFromReq(req: Request) {
        return req.user;
    }
}
