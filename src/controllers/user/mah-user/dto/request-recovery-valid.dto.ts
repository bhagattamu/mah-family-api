import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RequestRecoveryValidDto {
    @ApiProperty({
        example: 'userId',
        description: 'User id'
    })
    @IsNotEmpty()
    @IsString()
    readonly userId: string;
}
