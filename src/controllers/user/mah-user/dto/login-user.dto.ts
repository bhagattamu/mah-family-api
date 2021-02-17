import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
    @ApiProperty({
        example: 'bhagattamu@gmail.com',
        description: 'Email of user',
        minLength: 5
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @ApiProperty({
        example: 'pa$$word',
        description: 'Password of user',
        minLength: 5
    })
    @IsNotEmpty()
    @IsString()
    readonly password: string;
}
