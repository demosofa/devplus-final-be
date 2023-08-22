import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DeleteInterceptor } from '@common/interceptors/delete.interceptor';
import { join } from 'path';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
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
