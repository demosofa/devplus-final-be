import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { Auth } from '../../common/decorators';
import { ROLE, WORKSPACE_STATUS } from '../../common/enums';
import { PageOptionsDto } from './../../common/pagination/PageOptionDto';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspaceService } from './workspace.service';

@Controller('workspace')
export class WorkspaceController {
	constructor(private readonly workspaceService: WorkspaceService) {}

	@Post()
	create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
		return this.workspaceService.create(createWorkspaceDto);
	}

	@Get()
	findAll(@Query() pageOptionsDto: PageOptionsDto) {
		return this.workspaceService.findAll(pageOptionsDto);
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
