import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'src/@core/response';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectService } from './project.service';
import { Request } from 'express';
import { Roles } from 'src/@core/auth/guards/roles.decorator';
import { Role } from 'src/@core/auth/guards/role.enum';
import { RolesGuard } from 'src/@core/auth/guards/roles.guard';

@ApiTags('Project -> A family tree project')
@UseGuards(RolesGuard)
@Controller('ancestry/project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Create a project to build family tree.' })
    @ApiOkResponse({ description: 'Created project successfully' })
    async createProject(@Body() createProjectDto: CreateProjectDto, @Req() req: Request) {
        return new Response(true, await this.projectService.createProject(createProjectDto, req))
            .setStatus(HttpStatus.CREATED)
            .setMessage(['PROJECT_CREATED'])
            .setMiscellaneous(null);
    }

    @Get('user/all')
    @HttpCode(HttpStatus.OK)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Fetched a projects in which user involved.' })
    @ApiOkResponse({ description: 'Fetched project successfully' })
    async getAllProjectsAssociatedWithUser(@Req() req: Request) {
        return new Response(true, await this.projectService.getAllProjectsAssociatedWithUser(req))
            .setStatus(HttpStatus.OK)
            .setMessage(['FETCHED_PROJECT'])
            .setMiscellaneous(null);
    }

    @Get(':projectId')
    async getProjectById(@Param('projectId') projectId: string) {
        return new Response(true, await this.projectService.findProjectById(projectId))
            .setStatus(HttpStatus.OK)
            .setMessage(['FETCHED_PROJECT'])
            .setMiscellaneous(null);
    }
}
