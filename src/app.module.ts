import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { multerDiskConfig } from '@config/multerDisk.config';
import { DbConfigModule } from '@config/dbConfig.module';
import { JwtConfigModule } from '@config/jwtConfig.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from '@resources/auth/auth.module';
import { RoleModule } from '@resources/role/role.module';
import { UserModule } from '@resources/user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true,
			load: [multerDiskConfig],
		}),
		DbConfigModule,
		JwtConfigModule,
		RoleModule,
		UserModule,
		AuthModule,
	],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor,
		},
	],
})
export class AppModule {}
