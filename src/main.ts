import { DeleteInterceptor } from '@common/interceptors/delete.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	const configService = app.get(ConfigService);
	const CLIENT_URL = configService.get<string>('CLIENT_URL');

	app.use(
		helmet({
			crossOriginResourcePolicy: { policy: 'cross-origin' },
			contentSecurityPolicy: {
				directives: {
					'frame-ancestors': ["'self'", CLIENT_URL],
				},
			},
		})
	);
	app.enableCors();
	app.useGlobalInterceptors(new DeleteInterceptor());
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			// forbidNonWhitelisted: true,
			// forbidUnknownValues: true,
			validationError: { target: false },
		})
	);
	app.useStaticAssets(join(__dirname, '..', 'upload'), {
		index: false,
		prefix: '/upload',
	});

	await app.listen(3000);
}
bootstrap();
