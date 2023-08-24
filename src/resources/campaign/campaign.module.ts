import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity';
import { Workspace } from '@resources/workspace/entities/workspace.entity';
import { WorkspaceModule } from '@resources/workspace/workspace.module';
import { WorkspaceService } from '@resources/workspace/workspace.service';
import { UserModule } from '@resources/user/user.module';
import { RoleModule } from '@resources/role/role.module';
import { User } from '@resources/user/entities/user.entity';
import { Role } from '@resources/role/entities/role.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Campaign, Workspace, Role, User]),
		WorkspaceModule,
		RoleModule,
		UserModule,
	],
	controllers: [CampaignController],
	providers: [CampaignService, WorkspaceService],
})
export class CampaignModule {}
