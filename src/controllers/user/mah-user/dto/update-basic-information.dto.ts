import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateBasicInformationDto {
    @ApiProperty({
        example: 'Bhagat',
        description: 'First Name',
        minLength: 2,
        maxLength: 50,
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly firstName: string;

    @ApiProperty({
        example: 'Gurung',
        description: 'Last Name',
        minLength: 2,
        maxLength: 50,
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly lastName: string;

    @ApiProperty({
        example: 'bhagattamu@gmail.com',
        description: 'Email of the user',
        format: 'email'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @IsEmail()
    readonly email: string;

    @ApiProperty({
        example: '+9779819122180',
        description: 'Phone number of user',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    // @ApiProperty({
    //     example: 'https://www.bhagatgurung.com.np/bg.jpg',
    //     description: 'URL of image'
    // })
    // @IsOptional()
    // readonly profileImageURL: string;
}
