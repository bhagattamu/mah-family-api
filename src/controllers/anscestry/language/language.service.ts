import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { CreateLanguageDto } from './dto/create-language.dto';
import { ILanguage, IUserLanguage } from './interface/language.interface';

@Injectable()
export class LanguageService {
    constructor(@InjectModel('language') private readonly LanguageModel: Model<ILanguage>, @InjectModel('user-language') private readonly UserLanguageModel: Model<IUserLanguage>) {}

    async createNewLanguage(req: Request, createLanguageDto: CreateLanguageDto) {
        const userId = req.user['_id'];
        createLanguageDto['createdBy'] = userId;
        const newLanguage = await new this.LanguageModel(createLanguageDto).save();
        await this.forkLanguage(userId, newLanguage._id);
        return newLanguage;
    }

    async getAllLanguages(req: Request) {
        const { status } = req.query;
        return await this.LanguageModel.find({ status: status === 'active' ? true : false });
    }

    async activateLanguage(languageId: string) {
        await this.LanguageModel.updateOne({ _id: languageId }, { status: true });
    }

    async deactivatelanguage(languageId: string) {
        await this.LanguageModel.updateOne({ _id: languageId, status: false });
    }

    async addSupervisor() {}

    async getLanguageById(languageId: string) {
        return await this.LanguageModel.findById(languageId);
    }

    async searchLanguageByName(query: any) {
        const { languageName } = query;
        return await this.LanguageModel.find({ languageName: { $regex: languageName.toString(), $options: 'i' } });
    }

    async getAllForkedLanguage(req: Request) {
        const userId = req.user['_id'];
        return await this.UserLanguageModel.findOne({ user: userId }).populate('forkedLanguages.language');
    }

    async forkLanguage(userId: string, languageId: string) {
        const userLangauge = await this.UserLanguageModel.findOne({ user: userId });
        if (!userLangauge) {
            await new this.UserLanguageModel({ user: userId, forkedLanguages: [{ language: languageId, forkedDate: new Date() }] }).save();
        } else {
            await userLangauge.update({ $push: { forkedLanguages: { language: languageId, forkedDate: new Date(), status: true, block: false } } });
        }
    }

    async getLanguageByName(languageName: string) {
        return this.LanguageModel.findOne({ languageName: languageName });
    }
}
