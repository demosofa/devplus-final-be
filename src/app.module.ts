import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { multerDiskConfig } from '@config/multerDisk.config';
import { DbConfigModule } from '@config/dbConfig.module';
import { JwtConfigModule } from '@config/jwtConfig.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from '@resources/auth/auth.module';
import { RoleModule } from '@resources/role/role.module';
import { UserModule } from '@resources/user/user.module';
import { CampaignModule } from '@resources/campaign/campaign.module';
import { CvModule } from '@resources/cv/cv.module';
import { WorkspaceModule } from '@resources/workspace/workspace.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true,
			load: [multerDiskConfig],
		}),
		DbConfigModule,
		JwtConfigModule,
		ScheduleModule.forRoot(),
		RoleModule,
		UserModule,
		AuthModule,
		CampaignModule,
		CvModule,
		WorkspaceModule,
	],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor,
		},
	],
})
export class AppModule {}
