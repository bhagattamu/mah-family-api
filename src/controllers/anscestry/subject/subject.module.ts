import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectModule } from '../project/project.module';
import { SubjectSchema } from './schema/subject.schema';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'subject', schema: SubjectSchema }]), ProjectModule],
    controllers: [SubjectController],
    providers: [SubjectService],
    exports: [SubjectService]
})
export class SubjectModule {}
