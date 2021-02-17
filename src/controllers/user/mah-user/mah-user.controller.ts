import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Role } from 'src/@core/auth/guards/role.enum';
import { Roles } from 'src/@core/auth/guards/roles.decorator';
import { RolesGuard } from 'src/@core/auth/guards/roles.guard';
import { Response as MyResponse } from 'src/@core/response';
import { IResponse } from 'src/@core/response/response.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { NewUserDto } from './dto/new-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserResponse, LoginResponse, LogoutResponse, RefreshTokenResponse, VerifyUserResponse } from './dto/user-response.dto';
import { MahUserService } from './mah-user.service';

@ApiTags('User')
@Controller('user')
@UseGuards(RolesGuard)
export class MahUserController {
    constructor(private readonly userService: MahUserService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register user' })
    @ApiCreatedResponse({ description: 'Created Successfully', type: CreateUserResponse })
    async createUser(@Body() newUserDto: NewUserDto): Promise<IResponse> {
        try {
            return new MyResponse(true, await this.userService.createUser(newUserDto))
                .setStatus(HttpStatus.CREATED)
                .setMessage(['USER_REGISTERED'])
                .setMiscellaneous(null);
        } catch (err) {
            return new MyResponse(false, err)
                .setStatus(err.status)
                .setMessage(['REGISTER_FAILED', err.message])
                .setMiscellaneous(null);
        }
    }

    @UseGuards(RolesGuard)
    @Post('verify/:id')
    @HttpCode(HttpStatus.OK)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Verify User' })
    @ApiOkResponse({ description: 'Verified successfully', type: VerifyUserResponse })
    async verifyUser(@Param('id') userId: string) {
        try {
            return new MyResponse(true, await this.userService.verifyUser(userId))
                .setMessage(['VERIFIED'])
                .setStatus(HttpStatus.OK)
                .setMiscellaneous(null);
        } catch (err) {
            return new MyResponse(false, err)
                .setStatus(HttpStatus.BAD_REQUEST)
                .setMessage(['FAILED_VERIFICATION', err.message])
                .setMiscellaneous(null);
        }
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login user' })
    @ApiOkResponse({ description: 'Login success', type: LoginResponse })
    async login(@Body() loginUserDto: LoginUserDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        try {
            return new MyResponse(true, await this.userService.loginUser(loginUserDto, req, res))
                .setStatus(HttpStatus.OK)
                .setMessage(['LOGGED_IN'])
                .setMiscellaneous(null);
        } catch (err) {
            return new MyResponse(false, err)
                .setStatus(HttpStatus.BAD_REQUEST)
                .setMessage(['LOGGED_IN_FAILED', err.message])
                .setMiscellaneous(null);
        }
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh token' })
    @ApiOkResponse({ description: 'Refreshing token success', type: RefreshTokenResponse })
    async refreshToken(@Req() req: Request, @Body() refreshTokenDto: RefreshTokenDto, @Res({ passthrough: true }) res: Response) {
        try {
            return new MyResponse(true, await this.userService.refreshTokens(refreshTokenDto.accessToken, req, res))
                .setStatus(HttpStatus.OK)
                .setMessage(['REFRESHED_TOKEN'])
                .setMiscellaneous(null);
        } catch (err) {
            return new MyResponse(false, err)
                .setStatus(HttpStatus.UNAUTHORIZED)
                .setMessage(['TOKEN_REFRESH_FAILED', err.message])
                .setMiscellaneous(null);
        }
    }

    @UseGuards(RolesGuard)
    @Get('auth')
    @HttpCode(HttpStatus.OK)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Authenticate user' })
    @ApiOkResponse({ description: 'Authentication success' })
    async auth(@Req() req: Request) {
        try {
            return new MyResponse(true, await this.userService.authUserByToken(req))
                .setStatus(HttpStatus.OK)
                .setMessage(['AUTH_SUCCESS'])
                .setMiscellaneous(null);
        } catch (err) {
            return new MyResponse(false, err)
                .setStatus(HttpStatus.UNAUTHORIZED)
                .setMessage(['AUTH_FAILED', err.message])
                .setMiscellaneous(null);
        }
    }

    @UseGuards(RolesGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Logout user' })
    @ApiOkResponse({ description: 'Logout success', type: LogoutResponse })
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        try {
            return new MyResponse(true, await this.userService.logoutUser(req, res))
                .setStatus(HttpStatus.OK)
                .setMessage(['LOGGED_OUT'])
                .setMiscellaneous(null);
        } catch (err) {
            return new MyResponse(false, err)
                .setStatus(HttpStatus.BAD_REQUEST)
                .setMessage(['LOGOUT_FAILED', err.message])
                .setMiscellaneous(null);
        }
    }
}
