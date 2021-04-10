import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFamilyTimelineProjectDto {
    @ApiProperty({
        example: 'XYZ family timeline',
        description: 'Title of timeline project'
    })
    @IsNotEmpty()
    @IsString()
    readonly title: string;
}
