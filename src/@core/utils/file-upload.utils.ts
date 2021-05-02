import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';

export const imageFileFilter = (req, file, callback) => {
    const originalName = file?.originalname?.toLowerCase();
    if (!originalName?.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new HttpException('Only image files are allowed!', HttpStatus.BAD_REQUEST), false);
    }
    callback(null, true);
};

export const getProjectDestination = (req, file, callback) => {
    const path = process.cwd() + `/uploads/projects/project-${req.body.projectId}/`;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
    callback(null, `./uploads/projects/project-${req.body.projectId}`);
};

export const getProfileDestination = (req, file, callback) => {
    const path = process.cwd() + `/uploads/users/${req.user._id}/`;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
    callback(null, `./uploads/users/${req.user._id}`);
};

export const editFileName = (req, file, callback) => {
    const fileExtName = extname(file.originalname);
    const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 32).toString(32))
        .join('');
    callback(null, `${randomName}${fileExtName}`);
};
