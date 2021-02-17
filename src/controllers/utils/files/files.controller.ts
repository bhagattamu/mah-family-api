import { Controller, Get, Post, UseInterceptors, UploadedFile, UploadedFiles, Res, Param, HttpStatus, Req } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/@core/utils/file-upload.utils';

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

    // @Get('blog/:imagename')
    // getBlogImage(@Param('imagename') image, @Res() res) {
    //     const response = res.sendFile(image, { root: './uploads/blogs' });
    //     return {
    //         status: HttpStatus.OK,
    //         data: response
    //     };
    // }
}
