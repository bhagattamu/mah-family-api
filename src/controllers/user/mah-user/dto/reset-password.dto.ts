import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Matches, MaxLength, MIN, MinLength, MIN_LENGTH } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({
        example: 'password',
        description: 'New password'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    readonly password: string;

    @ApiProperty({
        example: 'recovery-password-id',
        description: 'encrypted recovery password id'
    })
    @IsNotEmpty()
    @IsUUID()
    @IsString()
    readonly key: string;

    @ApiProperty({
        example: 'user id',
        description: 'User id'
    })
    @IsNotEmpty()
    @IsString()
    readonly user: string;
}
