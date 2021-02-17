import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
    @ApiProperty({
        example: 'asdasdas.sdsd.sdsd',
        description: 'Access Token'
    })
    @IsNotEmpty()
    @IsString()
    readonly accessToken: string;
}
