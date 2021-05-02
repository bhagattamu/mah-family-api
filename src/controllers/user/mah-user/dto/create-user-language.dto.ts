import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLanguageDto {
    @ApiProperty({
        example: 'ObjectId 1',
        description: 'Main Language ID'
    })
    @IsNotEmpty()
    readonly nationalLanguage: string;

    @ApiProperty({
        example: 'ObjectId 1',
        description: 'Main Language ID'
    })
    @IsNotEmpty()
    readonly motherLanguage: string;

    @ApiProperty({
        example: ['ObjectId 1'],
        description: 'Other Language ID'
    })
    @IsOptional()
    readonly others: Array<string>;
}
