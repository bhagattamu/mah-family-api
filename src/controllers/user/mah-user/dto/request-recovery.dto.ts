import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RequestRecoveryDto {
    @ApiProperty({
        example: 'bhagattamu@gmail.com',
        description: 'Email of user'
    })
    @IsNotEmpty()
    @IsString()
    readonly emailOrPhone: string;
}
