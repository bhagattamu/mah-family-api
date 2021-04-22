import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NewUserDto {
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

    // @ApiProperty({
    //     example: ['user'],
    //     description: 'Array of roles',
    //     format: 'Array of string'
    // })
    // @IsNotEmpty()
    // @IsArray()
    // readonly roles: Array<string>;

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

    // @ApiProperty({
    //     example: 'P@$$w0rd123',
    //     description: 'Password of the user'
    // })
    // @IsNotEmpty()
    // @IsString()
    // @MinLength(5)
    // readonly password: string;

    @ApiProperty({
        example: '+9779819122180',
        description: 'Phone number of user',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly phone: string;
}
