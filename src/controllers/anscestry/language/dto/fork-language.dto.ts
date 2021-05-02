import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForkLanguageDto {
    @ApiProperty({
        example: {
            language: 'Object id of language'
        },
        description: 'Language id'
    })
    @IsNotEmpty()
    @IsString()
    readonly language: string;
}
