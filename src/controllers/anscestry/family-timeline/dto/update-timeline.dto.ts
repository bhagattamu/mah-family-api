import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { EmotionType } from 'src/@core/config/emotion.enum';
import { UpdateFamilyEventDto } from './update-family-event.dto';

export class UpdateTimelineDto {
    @ApiProperty({
        example: [
            {
                title: 'Birth of XYZ',
                type: 'birth',
                description: 'Lorem Ipsum',
                emotionType: EmotionType.HAPPY,
                images: ['path of image']
            }
        ],
        description: 'Array of Events'
    })
    @IsNotEmpty()
    @IsArray()
    eventDatas: Array<UpdateFamilyEventDto>;

    @ApiProperty({
        example: 'Title of timeline',
        description: 'Title'
    })
    @IsNotEmpty()
    @IsString()
    readonly title: string;

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
