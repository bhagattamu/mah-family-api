import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

class CreateLocationDto {
    @ApiProperty({
        example: 34.34343434,
        description: 'Longitude'
    })
    @IsNumber()
    readonly longitude: number;

    @ApiProperty({
        example: 87.3434343,
        description: 'Latitude'
    })
    @IsNumber()
    readonly latitude: number;
}

export class CreateUserFamilyDto {
    @ApiProperty({
        example: 'Gurung',
        description: 'Family Name'
    })
    @IsNotEmpty()
    @IsString()
    readonly familyName: string;

    @ApiProperty({
        example: 'Leghe',
        description: 'Sub Family Name'
    })
    @IsOptional()
    readonly subFamilyName: string;

    @ApiProperty({
        example: 'Kohla Shothar',
        description: 'User Language'
    })
    @IsOptional()
    origin: string;

    // @ApiProperty({
    //     example: {
    //         longitude: 34.32443434,
    //         latitude: 86.3435454
    //     },
    //     description: 'Location'
    // })
    // @IsOptional()
    // location: CreateLocationDto;
}
