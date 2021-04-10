import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFamilyTimelineProjectDto {
    @ApiProperty({
        example: 'projectId',
        description: 'Project Id'
    })
    @IsNotEmpty()
    @IsString()
    readonly project: string;

    @ApiProperty({
        example: 'XYZ family timeline',
        description: 'Title of timeline project'
    })
    @IsNotEmpty()
    @IsString()
    readonly title: string;
}
