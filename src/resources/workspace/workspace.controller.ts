import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { ROLE, WORKSPACE_STATUS } from '../../common/enums';
import { Auth } from '../../common/decorators';

@Controller('workspace')
export class WorkspaceController {
	constructor(private readonly workspaceService: WorkspaceService) {}

	@Post()
	create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
		return this.workspaceService.create(createWorkspaceDto);
	}

	@Get()
	findAll() {
		return this.workspaceService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.workspaceService.findOne(+id);
	}

	@Auth(ROLE.SUPER_ADMIN)
	@Patch('accept/:id')
	accept(@Param('id') id: string) {
		return this.workspaceService.update(+id, {
			status: WORKSPACE_STATUS.ACCEPT,
		});
	}

	@Auth(ROLE.SUPER_ADMIN)
	@Delete('reject/:id')
	reject(@Param('id') id: string) {
		return this.workspaceService.remove(+id);
	}
}
