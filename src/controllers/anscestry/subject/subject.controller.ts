import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/@core/auth/guards/role.enum';
import { Roles } from 'src/@core/auth/guards/roles.decorator';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { Response } from 'src/@core/response';
import { SubjectService } from './subject.service';
import { Request } from 'express';
import { RolesGuard } from 'src/@core/auth/guards/roles.guard';
import { CreateChildSubjectDto } from './dto/create-child-subject.dto';
import { diskStorage } from 'multer';
import { editFileName, getProjectDestination, imageFileFilter } from 'src/@core/utils/file-upload.utils';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Subject -> An individual to place in family tree') // Proband is a particular subject being studied, Proband is noted with square(male) and circle(female)
@UseGuards(RolesGuard)
@Controller('anscestry/proband')
export class SubjectController {
    constructor(private subjectService: SubjectService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor('userPicture', {
            storage: diskStorage({
                destination: getProjectDestination,
                filename: editFileName
            }),
            fileFilter: imageFileFilter
        })
    )
    @HttpCode(HttpStatus.CREATED)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Create a subject to build family tree.' })
    @ApiOkResponse({ description: 'Created subject successfully' })
    async createSubject(@Body() createSubjectDto: CreateSubjectDto, @UploadedFile() file: Express.Multer.File, @Req() req: Request) {
        return new Response(true, await this.subjectService.createSubject(createSubjectDto, req, file?.filename))
            .setStatus(HttpStatus.CREATED)
            .setMessage(['CREATED_SUBJECT'])
            .setMiscellaneous(null);
    }

    @Post('spouse/:subjectId')
    @UseInterceptors(
        FileInterceptor('userPicture', {
            storage: diskStorage({
                destination: getProjectDestination,
                filename: editFileName
            }),
            fileFilter: imageFileFilter
        })
    )
    @HttpCode(HttpStatus.CREATED)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Create a spouse to build family tree.' })
    @ApiOkResponse({ description: 'Created spouse successfully' })
    async addSpouse(@Body() createSubjectDto: CreateSubjectDto, @Param('subjectId') mateId: string, @UploadedFile() file: Express.Multer.File, @Req() req: Request) {
        return new Response(true, await this.subjectService.createSpouseForSubject(createSubjectDto, mateId, req, file?.filename))
            .setStatus(HttpStatus.CREATED)
            .setMessage(['CREATED_SPOUSE'])
            .setMiscellaneous(null);
    }

    @Post('child/:parentId')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(
        FileInterceptor('userPicture', {
            storage: diskStorage({
                destination: getProjectDestination,
                filename: editFileName
            }),
            fileFilter: imageFileFilter
        })
    )
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Create a spouse to build family tree.' })
    @ApiOkResponse({ description: 'Created spouse successfully' })
    async createChild(@Body() createChildSubjectDto: CreateChildSubjectDto, @UploadedFile() file: Express.Multer.File, @Param('parentId') firstParent: string, @Req() req: Request) {
        return new Response(true, await this.subjectService.createChildForSubject(createChildSubjectDto, firstParent, req, file?.filename ? file?.filename : ''))
            .setStatus(HttpStatus.CREATED)
            .setMessage(['CREATED_CHILD'])
            .setMiscellaneous(null);
    }

    @Get(':subjectId')
    @HttpCode(HttpStatus.OK)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Get subject by id.' })
    @ApiOkResponse({ description: 'Fetched subject by id successfully' })
    async findSubjectById(@Param('subjectId') subjectId: string, @Req() req: Request) {
        return new Response(true, await this.subjectService.getSubjectById(subjectId, req))
            .setStatus(HttpStatus.OK)
            .setMessage(['FETCHED_SUBJECT_BY_ID_SUCCESSFULLY'])
            .setMiscellaneous(null);
    }

    @Get('project/:projectId')
    @HttpCode(HttpStatus.OK)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Get all subject of a project.' })
    @ApiOkResponse({ description: 'Fetched all subject of a project successfully' })
    async getAllSubjectByProjectId(@Param('projectId') projectId: string, @Req() req: Request) {
        return new Response(true, await this.subjectService.getAllSubjectOfProjectId(projectId, req))
            .setStatus(HttpStatus.OK)
            .setMessage(['FETCHED_SUBJECT_SUCCESSFULLY'])
            .setMiscellaneous(null);
    }

    @Get('family-tree/:rootId')
    @HttpCode(HttpStatus.OK)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'authorization',
        description: 'Token send to api from header'
    })
    @ApiOperation({ summary: 'Get tree data of a root subject.' })
    @ApiOkResponse({ description: 'Fetched tree data successfully' })
    async getTreeData(@Param('rootId') rootId: string) {
        return new Response(true, await this.subjectService.getTreeData(rootId))
            .setStatus(HttpStatus.OK)
            .setMessage(['FETCHED_TREEDATA_SUCCESSFULLY'])
            .setMiscellaneous(null);
    }
}
