import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserResponse {
    @ApiProperty({
        example: true,
        description: 'Success'
    })
    readonly success: boolean;

    @ApiProperty({
        example: {
            firstName: 'Bhagat',
            lastName: 'Gurung',
            email: 'bhagattamu@gmail.com',
            phone: '9819123480',
            roles: ['user']
        },
        description: 'Data returned from Create User'
    })
    readonly data: any;

    @ApiProperty({
        example: null,
        description: 'Error object when error is encountered'
    })
    readonly error: any;

    @ApiProperty({
        example: '201',
        description: 'Http Status'
    })
    readonly httpStatus: number;

    @ApiProperty({
        example: ['USER_REGISTERED'],
        description: 'Message'
    })
    readonly message: Array<string>;

    @ApiProperty({
        example: [],
        description: 'Miscellaneous data'
    })
    readonly miscellaneous: any;
}
