import { HttpException, HttpStatus } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerDiskConfig = registerAs(
	'multerConfig',
	(): MulterOptions => ({
		storage: diskStorage({
			destination(req, file, callback) {
				const uploadPath = './upload';
				if (!existsSync(uploadPath)) {
					mkdirSync(uploadPath);
				}
				callback(null, uploadPath);
			},

			filename(req, file, callback) {
				return callback(null, `${Date.now()}${extname(file.originalname)}`);
			},
		}),

		fileFilter(req, file, callback) {
			if (file.mimetype.match(/pdf/)) {
				callback(null, true);
			} else
				callback(
					new HttpException(
						`Unsupported file type ${extname(file.originalname)}`,
						HttpStatus.UNPROCESSABLE_ENTITY
					),
					false
				);
		},

		limits: {
			fileSize: 2 * 1024 * 1024,
		},
	})
);
