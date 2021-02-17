import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectSchema } from './schema/project.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'project', schema: ProjectSchema }])],
    controllers: [ProjectController],
    providers: [ProjectService],
    exports: [ProjectService]
})
export class ProjectModule {}
