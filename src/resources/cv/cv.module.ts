import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { Cv } from './entities/cv.entity';
import { User } from '../user/entities/user.entity';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { Campaign } from '../campaign/entities/campaign.entity';
import { Role } from '../role/entities/role.entity';
import { MulterConfigModule } from '@config/multerConfig.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Cv, User, Role, Campaign]),
		RoleModule,
		UserModule,
		MulterConfigModule,
	],
	controllers: [CvController],
	providers: [CvService],
	exports: [CvService],
})
export class CvModule {}
