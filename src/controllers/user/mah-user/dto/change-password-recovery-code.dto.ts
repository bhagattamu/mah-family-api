import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordByCodeDto {
    @ApiProperty({
        example: '2s4g2435',
        description: 'Recovery code sent in email'
    })
    @IsNotEmpty()
    @IsString()
    readonly recoveryCode: string;

    @ApiProperty({
        example: 'userId',
        description: 'User id'
    })
    @IsNotEmpty()
    @IsString()
    readonly user: string;
}
