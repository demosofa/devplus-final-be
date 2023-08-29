import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { User } from '@resources/user/entities/user.entity';
import { Role } from '@resources/role/entities/role.entity';
import { Campaign } from '@resources/campaign/entities/campaign.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Workspace, User, Role, Campaign]),
		RoleModule,
		UserModule,
	],
	controllers: [WorkspaceController],
	providers: [WorkspaceService],
	exports: [WorkspaceService],
})
export class WorkspaceModule {}
