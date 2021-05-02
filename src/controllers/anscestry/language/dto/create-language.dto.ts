import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLanguageDto {
    @ApiProperty({
        example: 'Gurung',
        description: 'Language name'
    })
    @IsNotEmpty()
    @IsString()
    readonly languageName: string;

    @ApiProperty({
        example: 'Gurung language description',
        description: 'Language description'
    })
    @IsOptional()
    @IsString()
    readonly languageDescription: string;

    @ApiProperty({
        example: {
            location: {
                address: 'Kohla Shothar'
            },
            description: 'It is originated from gurung family from past'
        },
        description: 'Origin of gurung language'
    })
    @IsOptional()
    origin: {
        location: {
            longitude: number;
            latitude: number;
            Address: string;
        };
        description: string;
    };
}
