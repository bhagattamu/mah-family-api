import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'src/@core/response';
import { IResponse } from 'src/@core/response/response.interface';
import { NewUserDto } from './dto/new-user.dto';
import { CreateUserResponse } from './dto/user-response.dto';
import { MahUserService } from './mah-user.service';

@ApiTags('User')
@Controller('user')
export class MahUserController {
    constructor(private readonly userService: MahUserService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register user' })
    @ApiCreatedResponse({ description: 'Created Successfully', type: CreateUserResponse })
    async createUser(@Body() newUserDto: NewUserDto): Promise<IResponse> {
        try {
            return new Response(true, await this.userService.createUser(newUserDto))
                .setStatus(HttpStatus.CREATED)
                .setMessage(['USER_REGISTERED'])
                .setMiscellaneous([]);
        } catch (err) {
            return new Response(false, err)
                .setStatus(err.status)
                .setMessage(['REGISTER_FAILED', err.message])
                .setMiscellaneous([]);
        }
    }
}
