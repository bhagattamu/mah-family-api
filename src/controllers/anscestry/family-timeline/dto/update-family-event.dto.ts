import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EmotionType } from 'src/@core/config/emotion.enum';
import { IImage } from '../interfaces/fam-event.interface';

export class UpdateFamilyEventDto {
    @ApiProperty({
        example: 'Id of event',
        description: 'Event Id'
    })
    @IsNotEmpty()
    @IsString()
    readonly eventId: string;

    @ApiProperty({
        example: 'Birth of XYZ',
        description: 'Event title'
    })
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @ApiProperty({
        example: 'birth',
        description: 'Event Type'
    })
    @IsOptional()
    readonly type: string;

    @ApiProperty({
        example: 'Lorem Ipsum',
        description: 'Event Description'
    })
    @IsOptional()
    readonly description: string;

    @ApiProperty({
        example: EmotionType.HAPPY,
        description: 'What type of emotion was in event'
    })
    @IsOptional()
    readonly emotionType: string;

    readonly images: Array<IImage>;
}
