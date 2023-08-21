import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get('SECRET'),
				// signOptions: { expiresIn: '60s' },
			}),
			global: true,
		}),
	],
	exports: [JwtModule],
})
export class JwtConfigModule {}
