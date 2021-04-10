import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Role } from 'src/@core/auth/guards/role.enum';
import { Roles } from 'src/@core/auth/guards/roles.decorator';
import { RolesGuard } from 'src/@core/auth/guards/roles.guard';
import { Response as MyResponse } from 'src/@core/response';
import { IResponse } from 'src/@core/response/response.interface';
import { ChangePasswordByCodeDto } from './dto/change-password-recovery-code.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { NewUserDto } from './dto/new-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RequestRecoveryValidDto } from './dto/request-recovery-valid.dto';
import { RequestRecoveryDto } from './dto/request-recovery.dto';
import { ReSendRequestRecoveryDto } from './dto/resend-request-recovery.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
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
        return new MyResponse(true, await this.userService.createUser(newUserDto))
            .setStatus(HttpStatus.CREATED)
            .setMessage(['USER_REGISTERED'])
            .setMiscellaneous(null);
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
        return new MyResponse(true, await this.userService.verifyUser(userId))
            .setMessage(['VERIFIED'])
            .setStatus(HttpStatus.OK)
            .setMiscellaneous(null);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login user' })
    @ApiOkResponse({ description: 'Login success', type: LoginResponse })
    async login(@Body() loginUserDto: LoginUserDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        return new MyResponse(true, await this.userService.authUser(loginUserDto, req, res))
            .setStatus(HttpStatus.OK)
            .setMessage(['LOGGED_IN'])
            .setMiscellaneous(null);
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh token' })
    @ApiOkResponse({ description: 'Refreshing token success', type: RefreshTokenResponse })
    async refreshToken(@Req() req: Request, @Body() refreshTokenDto: RefreshTokenDto, @Res({ passthrough: true }) res: Response) {
        return new MyResponse(true, await this.userService.refreshTokens(refreshTokenDto.accessToken, req, res))
            .setStatus(HttpStatus.OK)
            .setMessage(['REFRESHED_TOKEN'])
            .setMiscellaneous(null);
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
        return new MyResponse(true, await this.userService.authUserByToken(req))
            .setStatus(HttpStatus.OK)
            .setMessage(['AUTH_SUCCESS'])
            .setMiscellaneous(null);
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
        return new MyResponse(true, await this.userService.logoutUser(req, res))
            .setStatus(HttpStatus.OK)
            .setMessage(['LOGGED_OUT'])
            .setMiscellaneous(null);
    }

    @Post('request-recovery')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Send recovery email to user' })
    @ApiOkResponse({ description: 'Recovery email sent successfully', type: LogoutResponse })
    async forgetPassword(@Body() requestRecoveryDto: RequestRecoveryDto, @Res({ passthrough: true }) res: Response) {
        return new MyResponse(true, await this.userService.sendResetPasswordCodeAndLink(requestRecoveryDto.emailOrPhone, res))
            .setStatus(HttpStatus.CREATED)
            .setMessage(['RECOVERY_EMAIL_SENT'])
            .setMiscellaneous(null);
    }

    @Post('resend-request-recovery')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Send recovery email to user' })
    @ApiOkResponse({ description: 'Recovery email sent successfully', type: LogoutResponse })
    async reSendRequestRecovery(@Body() reSendRequestRecoveryDto: ReSendRequestRecoveryDto, @Res({ passthrough: true }) res: Response) {
        return new MyResponse(true, await this.userService.reSendResetPasswordCodeAndLink(reSendRequestRecoveryDto.userId, res))
            .setStatus(HttpStatus.CREATED)
            .setMessage(['RECOVERY_EMAIL_SENT'])
            .setMiscellaneous(null);
    }

    @Get('request-recovery-valid/:userId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Check recovery code validity' })
    @ApiOkResponse({ description: 'Route is valid', type: LogoutResponse })
    async checkValidRecoveryCodeRoute(@Req() req: Request, @Param('userId') userId: string) {
        if (!userId) {
            throw new BadRequestException('FORBIDDEN_ROUTE');
        }
        return new MyResponse(true, await this.userService.checkValidRecoveryCodeRoute(req, userId))
            .setStatus(HttpStatus.OK)
            .setMessage(['ROUTE_IS_VALID'])
            .setMiscellaneous(null);
    }

    @Post('reset-password-route')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Check recovery code validity' })
    @ApiOkResponse({ description: 'Route is valid', type: LogoutResponse })
    async generateValidResetPasswordRoute(@Req() req: Request, @Body() changePasswordByCodeDto: ChangePasswordByCodeDto) {
        return new MyResponse(true, await this.userService.changePasswordByCode(changePasswordByCodeDto, req))
            .setStatus(HttpStatus.CREATED)
            .setMessage(['ROUTE_IS_VALID'])
            .setMiscellaneous(null);
    }

    @Get('reset-password-valid')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Check reset password route validity' })
    @ApiOkResponse({ description: 'Route is valid', type: LogoutResponse })
    async checkValidResetPasswordRoute(@Req() req: Request) {
        const { key, id } = req.query;
        if (!key || !id) {
            throw new BadRequestException('FORBIDDEN_ROUTE');
        }
        return new MyResponse(true, await this.userService.checkRecoveryTokenValidity(id.toString(), key.toString()))
            .setStatus(HttpStatus.OK)
            .setMessage(['ROUTE_IS_VALID'])
            .setMiscellaneous(null);
    }

    @Put('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reset password' })
    @ApiOkResponse({ description: 'Password changed successfully', type: LogoutResponse })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        return new MyResponse(true, await this.userService.resetPassword(resetPasswordDto, req, res))
            .setStatus(HttpStatus.OK)
            .setMessage(['PASSWORD_CHANGED'])
            .setMiscellaneous(null);
    }
}
