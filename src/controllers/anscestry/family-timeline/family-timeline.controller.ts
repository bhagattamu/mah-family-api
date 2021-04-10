import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Role } from 'src/@core/auth/guards/role.enum';
import { Roles } from 'src/@core/auth/guards/roles.decorator';
import { RolesGuard } from 'src/@core/auth/guards/roles.guard';
import { Response } from 'src/@core/response';
import { CreateFamilyTimelineProjectDto } from './dto/create-family-timeline-project.dto';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateFamilyTimelineProjectDto } from './dto/update-family-timeline-project.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { FamilyTimelineService } from './family-timeline.service';

@ApiTags('Timeline of ancestry')
@Controller('ancestry/timeline')
export class FamilyTimelineController {
    constructor(private readonly familyTimelineService: FamilyTimelineService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Create a timeline project to build family timeline.' })
    @ApiOkResponse({ description: 'Created timeline project successfully' })
    async createFamilyTimelineProject(@Req() req: Request, @Body() createFamilyTimelineProjectDto: CreateFamilyTimelineProjectDto) {
        return new Response(true, await this.familyTimelineService.createFamilyTimelineProject(req, createFamilyTimelineProjectDto))
            .setStatus(HttpStatus.CREATED)
            .setMessage(['CREATED_TIMELINE_PROJECT'])
            .setMiscellaneous(null);
    }

    @Get('all')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Get all timeline from project.' })
    @ApiOkResponse({ description: 'Timeline fetched successfully' })
    async getTimelineProjects(@Req() req: Request) {
        return new Response(true, await this.familyTimelineService.getAllTimelineProject(req.query.projectId.toString()))
            .setStatus(HttpStatus.OK)
            .setMessage(['ALL_TIMELINE_PROJECT_OF_PROJECT_FETCHED'])
            .setMiscellaneous(null);
    }

    @Get(':timelineId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Get timeline from timeline id.' })
    @ApiOkResponse({ description: 'Individual Timeline fetched successfully' })
    async getTimelineProjectDetail(@Param('timelineId') timelineId: string) {
        return new Response(true, await this.familyTimelineService.getTimelineProjectDetail(timelineId))
            .setStatus(HttpStatus.OK)
            .setMessage(['TIMELINE_FETCHED'])
            .setMiscellaneous(null);
    }

    @Put(':timelineId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Update a timeline.' })
    @ApiOkResponse({ description: 'Updated timeline successfully' })
    async updateFamilyTimelineProject(@Body() updateFamilyTimelineProjectDto: UpdateFamilyTimelineProjectDto, @Param('timelineId') timelineId: string) {
        return new Response(true, await this.familyTimelineService.updateTimelineProject(timelineId, updateFamilyTimelineProjectDto))
            .setStatus(HttpStatus.OK)
            .setMessage(['UPDATED_TIMELINE_PROJECT'])
            .setMiscellaneous(null);
    }

    @Post('/point')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Create a timeline point to build family timeline.' })
    @ApiOkResponse({ description: 'Created timeline point successfully' })
    async createFamilyTimelinePoint(@Req() req: Request, @Body() createFamilyTimelineDto: CreateTimelineDto) {
        return new Response(true, await this.familyTimelineService.createFamilyTimelinePoint(req, createFamilyTimelineDto))
            .setStatus(HttpStatus.CREATED)
            .setMessage(['CREATED_POINT_IN_TIMELINE'])
            .setMiscellaneous(null);
    }

    @Get('/point/all')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Get a timeline from project.' })
    @ApiOkResponse({ description: 'Timeline fetched successfully' })
    async getTimeline(@Req() req: Request) {
        return new Response(true, await this.familyTimelineService.getAllTimelinePointOfProject(req.query.timelineProjectId.toString()))
            .setStatus(HttpStatus.OK)
            .setMessage(['ALL_TIMELINE_OF_PROJECT_FETCHED'])
            .setMiscellaneous(null);
    }

    @Get('/point/:pointId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Get a timeline point from timeline id.' })
    @ApiOkResponse({ description: 'Individual Timeline point fetched successfully' })
    async getTimelinePointById(@Req() req: Request, @Param('pointId') pointId: string) {
        return new Response(true, await this.familyTimelineService.getTimelinePointById(req.query.timelineProjectId.toString(), pointId))
            .setStatus(HttpStatus.OK)
            .setMessage(['TIMELINE_POINT_FETCHED'])
            .setMiscellaneous(null);
    }

    @Put('/point/:pointId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Update a timeline point to build family timeline.' })
    @ApiOkResponse({ description: 'Updated timeline point successfully' })
    async updateFamilyTimelinePoint(@Req() req: Request, @Body() updateFamilyTimelineDto: UpdateTimelineDto, @Param('pointId') pointId: string) {
        return new Response(true, await this.familyTimelineService.updateTimelinePointById(req, pointId, updateFamilyTimelineDto))
            .setStatus(HttpStatus.OK)
            .setMessage(['UPDATED_POINT_IN_TIMELINE'])
            .setMiscellaneous(null);
    }

    @Delete('/point/:pointId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Delete a timeline point in a family timeline.' })
    @ApiOkResponse({ description: 'Deleted timeline point successfully' })
    async deleteFamilyTimelinePointById(@Req() req: Request, @Param('pointId') pointId: string) {
        return new Response(true, await this.familyTimelineService.deleteTimelinePointById(req.query.timelineProjectId.toString(), pointId))
            .setStatus(HttpStatus.OK)
            .setMessage(['DELETED_POINT_IN_TIMELINE'])
            .setMiscellaneous(null);
    }

    @Delete('/point')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Delete a all timelines of project' })
    @ApiOkResponse({ description: 'Deleted all timeline point successfully' })
    async deleteFamilyTimelinePointsByProject(@Req() req: Request) {
        return new Response(true, await this.familyTimelineService.deleteTimelinePointsByProject(req.query.timelineProjectId.toString()))
            .setStatus(HttpStatus.OK)
            .setMessage(['DELETED_TIMELINE_POINTS_OF_PROJECT'])
            .setMiscellaneous(null);
    }
}
