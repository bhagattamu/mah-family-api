import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForkedLanguageDto {
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

export class CreateUserLanguage {
    @ApiProperty({
        example: [
            {
                language: 'Object id of language'
            }
        ],
        description: 'Language name'
    })
    @IsNotEmpty()
    readonly forkedLanguages: Array<ForkedLanguageDto>;
}
