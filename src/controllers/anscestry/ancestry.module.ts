import { Module } from '@nestjs/common';
import { FamilyTimelineModule } from './family-timeline/family-timeline.module';
import { ProjectModule } from './project/project.module';
import { SubjectModule } from './subject/subject.module';

@Module({
    imports: [ProjectModule, SubjectModule, FamilyTimelineModule]
})
export class AncestryModule {}
