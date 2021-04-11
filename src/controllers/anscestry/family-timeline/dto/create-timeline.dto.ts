import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { EmotionType } from 'src/@core/config/emotion.enum';
import { CreateFamilyEventDto } from './create-family-event.dto';

export class CreateTimelineDto {
    @ApiProperty({
        example: [
            {
                title: 'Birth of XYZ',
                type: 'birth',
                description: 'Lorem Ipsum',
                timestamp: Date.now,
                emotionType: EmotionType.HAPPY,
                images: ['path of image']
            }
        ],
        description: 'Array of Events'
    })
    @IsNotEmpty()
    @IsArray()
    eventDatas: Array<CreateFamilyEventDto>;

    @ApiProperty({
        example: Date.now,
        description: 'Timestamp of event'
    })
    @IsNotEmpty()
    readonly date: Date;

    @ApiProperty({
        example: 'timeline project id',
        description: 'Timeline Project id'
    })
    @IsNotEmpty()
    @IsString()
    readonly timelineProject: string;

    @ApiProperty({
        example: 'subject id',
        description: 'Subject which timeline is created'
    })
    @IsNotEmpty()
    @IsString()
    readonly subject: string;
}
