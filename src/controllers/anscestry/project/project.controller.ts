import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'src/@core/response';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectService } from './project.service';
import { Request } from 'express';
import { Roles } from 'src/@core/auth/guards/roles.decorator';
import { Role } from 'src/@core/auth/guards/role.enum';
import { RolesGuard } from 'src/@core/auth/guards/roles.guard';
import { ProjectModuleMessages } from 'src/@core/response/error/project.constant';

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
            .setMessage(ProjectModuleMessages.PROJECT_CREATED)
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
            .setMessage(ProjectModuleMessages.PROJECTS_FETCHED)
            .setMiscellaneous(null);
    }

    @Get(':projectId')
    async getProjectById(@Param('projectId') projectId: string) {
        return new Response(true, await this.projectService.findProjectById(projectId))
            .setStatus(HttpStatus.OK)
            .setMessage(ProjectModuleMessages.PROJECT_FETCHED)
            .setMiscellaneous(null);
    }

    @Put(':projectId')
    async updateProjectById(@Param('projectId') projectId: string, @Body() updateProjectDto: CreateProjectDto) {
        return new Response(true, await this.projectService.updateProjectById(projectId, updateProjectDto))
            .setStatus(HttpStatus.OK)
            .setMessage(ProjectModuleMessages.PROJECT_UPDATED)
            .setMiscellaneous(null);
    }
}
