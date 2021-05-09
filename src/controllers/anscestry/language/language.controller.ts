import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/@core/auth/guards/role.enum';
import { Roles } from 'src/@core/auth/guards/roles.decorator';
import { CreateLanguageDto } from './dto/create-language.dto';
import { LanguageService } from './language.service';
import { Response } from 'src/@core/response';
import { Request } from 'express';
import { RolesGuard } from 'src/@core/auth/guards/roles.guard';
import { ForkLanguageDto } from './dto/fork-language.dto';

@ApiTags('Api of language')
@Controller('ancestry/language')
export class LanguageController {
    constructor(private readonly languageService: LanguageService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Create a language.' })
    @ApiOkResponse({ description: 'Created new language successfully' })
    async createNewLanguage(@Body() createLanguageDto: CreateLanguageDto, @Req() req: Request) {
        return new Response(true, await this.languageService.createNewLanguage(req, createLanguageDto))
            .setStatus(HttpStatus.CREATED)
            .setMessage('LANGUAGE_CREATED')
            .setMiscellaneous(null);
    }

    @Get('all')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Fetched all languages in ancestry culture.' })
    @ApiOkResponse({ description: 'Fetched languages successfully' })
    async getAllLanguage(@Req() req: Request) {
        return new Response(true, await this.languageService.getAllLanguages(req))
            .setStatus(HttpStatus.OK)
            .setMessage('FETCHED_LANGUAGES')
            .setMiscellaneous(null);
    }

    @Get('search')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Search language by name in ancestry culture.' })
    @ApiOkResponse({ description: 'Fetched language successfully' })
    async searchLanguage(@Req() req: Request) {
        return new Response(true, await this.languageService.searchLanguageByName(req.query))
            .setStatus(HttpStatus.OK)
            .setMessage('FETCHED_LANGUAGE')
            .setMiscellaneous(null);
    }

    @Post('/fork')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Fork language in ancestry culture.' })
    @ApiOkResponse({ description: 'Forked language successfully' })
    async forkLanguage(@Body() forkLanguageDto: ForkLanguageDto, @Req() req: Request) {
        return new Response(true, await this.languageService.forkLanguage(req.user['_id'], forkLanguageDto.language))
            .setStatus(HttpStatus.CREATED)
            .setMessage('FORKED_LANGUAGE')
            .setMiscellaneous(null);
    }

    @Get('/forked')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Fetch forked language in ancestry culture.' })
    @ApiOkResponse({ description: 'Fetched language successfully' })
    async getAllForkedLanguage(@Req() req: Request) {
        return new Response(true, await this.languageService.getAllForkedLanguage(req))
            .setStatus(HttpStatus.OK)
            .setMessage('FETCHED_LANGUAGE')
            .setMiscellaneous(null);
    }

    @Get(':languageId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Fetch language by id in ancestry culture.' })
    @ApiOkResponse({ description: 'Fetched language successfully' })
    async getLanguageById(@Param('languageId') languageId: string) {
        return new Response(true, await this.languageService.getLanguageById(languageId))
            .setStatus(HttpStatus.OK)
            .setMessage('FETCHED_LANGUAGE')
            .setMiscellaneous(null);
    }

    @Put('activate/:languageId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Activate language in ancestry culture.' })
    @ApiOkResponse({ description: 'Activated language successfully' })
    async activateLanguage(@Param('languageId') languageId: string) {
        return new Response(true, await this.languageService.activateLanguage(languageId))
            .setStatus(HttpStatus.OK)
            .setMessage('ACTIVATED_LANGUAGE')
            .setMiscellaneous(null);
    }

    @Put('deactivate/:languageId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Deactivate language in ancestry culture.' })
    @ApiOkResponse({ description: 'Deactivated language successfully' })
    async deactivateLanguage(@Param('languageId') languageId: string) {
        return new Response(true, await this.languageService.deactivatelanguage(languageId))
            .setStatus(HttpStatus.OK)
            .setMessage('DEACTIVATED_LANGUAGE')
            .setMiscellaneous(null);
    }
}
