import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
    @ApiProperty({
        example: 'Gurung Family',
        description: 'Project name'
    })
    @IsNotEmpty()
    @IsString()
    readonly projectName: string;

    @ApiProperty({
        example: ['safasfasf', 'sdasdasd'],
        description: 'Array of userId active for contribution in this project'
    })
    readonly contributors: Array<any>;
}
