import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FamilyTimelineController } from './family-timeline.controller';
import { FamilyTimelineService } from './family-timeline.service';
import { FamilyEventSchema } from './schema/fam-event.schema';
import { FamilyTimelineProjectSchema } from './schema/fam-timeline-project.schema';
import { FamilyTimelineSchema } from './schema/family-timeline.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'family-timeline-project', schema: FamilyTimelineProjectSchema },
            { name: 'fam-event', schema: FamilyEventSchema },
            { name: 'family-timeline', schema: FamilyTimelineSchema }
        ])
    ],
    controllers: [FamilyTimelineController],
    providers: [FamilyTimelineService],
    exports: [FamilyTimelineService]
})
export class FamilyTimelineModule {}
