import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

@Module({
	imports: [
		MulterModule.registerAsync({
			inject: [ConfigService],
			useFactory(configService: ConfigService) {
				return configService.get<MulterOptions>('multerConfig');
			},
		}),
	],
	exports: [MulterModule],
})
export class MulterConfigModule {}
