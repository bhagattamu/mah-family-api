import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { SubjectModule } from './subject/subject.module';

@Module({
    imports: [ProjectModule, SubjectModule]
})
export class AncestryModule {}
