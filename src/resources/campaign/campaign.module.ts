import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity';
import { UserModule } from '@resources/user/user.module';
import { RoleModule } from '@resources/role/role.module';
import { User } from '@resources/user/entities/user.entity';
import { Role } from '@resources/role/entities/role.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Campaign, Role, User]),
		RoleModule,
		UserModule,
	],
	controllers: [CampaignController],
	providers: [CampaignService],
})
export class CampaignModule {}
