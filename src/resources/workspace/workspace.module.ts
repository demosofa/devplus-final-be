import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';

@Module({
	imports: [TypeOrmModule.forFeature([Workspace]), RoleModule, UserModule],
	controllers: [WorkspaceController],
	providers: [WorkspaceService],
})
export class WorkspaceModule {}
