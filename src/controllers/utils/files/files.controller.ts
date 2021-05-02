import { Controller, Get, Post, UseInterceptors, UploadedFile, UploadedFiles, Res, Param, HttpStatus, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { Role } from 'src/@core/auth/guards/role.enum';
import { Roles } from 'src/@core/auth/guards/roles.decorator';
import { RolesGuard } from 'src/@core/auth/guards/roles.guard';
import { editFileName, imageFileFilter } from 'src/@core/utils/file-upload.utils';
import * as fs from 'fs';

@Controller('files')
export class FilesController {
    // @Post()
    // @UseInterceptors(
    //     FileInterceptor('image', {
    //         storage: diskStorage({
    //             destination: './uploads',
    //             filename: editFileName
    //         }),
    //         fileFilter: imageFileFilter
    //     })
    // )
    // async uploadedFile(@UploadedFile() file) {
    //     const response = {
    //         originalname: file.originalname,
    //         filename: file.filename,
    //         url: `${process.env.API_URL}/files/${file.filename}`
    //     };
    //     return {
    //         status: HttpStatus.OK,
    //         message: 'Image uploaded successfully!',
    //         data: response
    //     };
    // }

    // @Post('blog')
    // @UseInterceptors(
    //     FileInterceptor('file', {
    //         storage: diskStorage({
    //             destination: './uploads/blogs',
    //             filename: editFileName
    //         }),
    //         fileFilter: imageFileFilter
    //     })
    // )
    // async uploadedBlogFile(@UploadedFile() file) {
    //     const response = {
    //         originalname: file.originalname,
    //         filename: file.filename
    //     };
    //     return {
    //         status: HttpStatus.OK,
    //         message: 'Image uploaded successfully!',
    //         data: response,
    //         imageUrl: `${process.env.API_URL}/files/blog/${file.filename}`
    //     };
    // }

    // @Post('uploadMultipleFiles')
    // @UseInterceptors(
    //     FilesInterceptor('image', 10, {
    //         storage: diskStorage({
    //             destination: './uploads',
    //             filename: editFileName
    //         }),
    //         fileFilter: imageFileFilter
    //     })
    // )
    // async uploadMultipleFiles(@UploadedFiles() files) {
    //     const response = [];
    //     files.forEach(file => {
    //         const fileReponse = {
    //             originalname: file.originalname,
    //             filename: file.filename
    //         };
    //         response.push(fileReponse);
    //     });
    //     return {
    //         status: HttpStatus.OK,
    //         message: 'Images uploaded successfully!',
    //         data: response
    //     };
    // }

    @Get('/subject-picture/:projectId/:imagename')
    getImage(@Param('imagename') image, @Param('projectId') projectId, @Res() res) {
        const response = res.sendFile(image, { root: './uploads/projects/project-' + projectId });
        return {
            status: HttpStatus.OK,
            data: response
        };
    }

    @Get('/user-picture/:userId/:imagename')
    @ApiOperation({ summary: 'Get profile picture' })
    getProfilePicture(@Param('imagename') image, @Param('userId') userId: string, @Req() req: Request, @Res() res) {
        if (fs.existsSync(process.cwd() + `/uploads/users/${userId}/${image}`)) {
            res.sendFile(image, { root: `./uploads/users/${userId}` });
        } else {
            throw new NotFoundException('Profile picture not found');
        }
    }

    @Get('/user/pictures/:userId')
    @ApiOperation({ summary: 'Get all pictures' })
    getAllPictures(@Param('userId') userId: string, @Req() req: Request, @Res() res) {
        if (fs.existsSync(process.cwd() + `/uploads/users/${userId}`)) {
            const files = fs.readdirSync(process.cwd() + `/uploads/users/${userId}`);
            if (files.length) {
                res.json(files);
            } else {
                throw new NotFoundException('Pictures not found');
            }
        } else {
            throw new NotFoundException('Pictures not found');
        }
    }

    // @Get('blog/:imagename')
    // getBlogImage(@Param('imagename') image, @Res() res) {
    //     const response = res.sendFile(image, { root: './uploads/blogs' });
    //     return {
    //         status: HttpStatus.OK,
    //         data: response
    //     };
    // }
}
