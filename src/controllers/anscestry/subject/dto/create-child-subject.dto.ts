import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChildSubjectDto {
    @ApiProperty({
        example: ';ajsasjfajfsa;jfa;sjdsd',
        description: 'Project id for this subject'
    })
    @IsNotEmpty()
    @IsString()
    readonly projectId: string;

    @ApiProperty({
        example: ';ajsasjfajfsa;jfa;sjdsd',
        description: 'Parent id for this subject'
    })
    @IsNotEmpty()
    @IsString()
    readonly parent: string;

    @ApiProperty({
        example: 'Bhagat',
        description: 'First name of the subject'
    })
    @IsNotEmpty()
    @IsString()
    readonly firstName: string;

    @ApiProperty({
        example: 'Gurung',
        description: 'Last name of the subject'
    })
    @IsOptional()
    readonly lastName: string;

    @ApiProperty({
        example: 'M',
        description: 'Male'
    })
    @IsNotEmpty()
    @IsString()
    readonly gender: string;

    @ApiProperty({
        example: 'Nepal',
        description: 'Country of subject'
    })
    @IsOptional()
    readonly country: string;

    @ApiProperty({
        example: 'Pokhara',
        description: 'Address of subject'
    })
    @IsOptional()
    readonly address: string;

    @ApiProperty({
        example: {
            main: 'jaisjdoiasjfdioasfd',
            sub: 'asijoaijfoasjfoasfoaf'
        },
        description: 'Object Id of family-name and family-sub-group'
    })
    @IsOptional()
    readonly familyName: any;

    @ApiProperty({
        example: 'https://www.bhagatgurung.com.np/bg.jpg',
        description: 'URL of image'
    })
    @IsOptional()
    readonly imageUrl: string;

    @ApiProperty({
        example: true,
        description: 'Living status'
    })
    @IsNotEmpty()
    readonly isLiving: boolean;

    @ApiProperty({
        example: new Date(),
        description: 'Date of birth'
    })
    @IsOptional()
    readonly dateOfBirth: Date;

    @ApiProperty({
        example: new Date(),
        description: 'Date of death'
    })
    @IsOptional()
    readonly dateOfDeath: Date;

    @IsOptional()
    marriages: Array<any>;
}
