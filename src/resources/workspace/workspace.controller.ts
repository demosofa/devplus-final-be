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

// import { Auth } from '../../common/decorators';
import { ROLE, WORKSPACE_STATUS } from '../../common/enums';
import { PageOptionsDto } from './../../common/pagination/PageOptionDto';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspaceService } from './workspace.service';
import { Auth } from '@common/decorators';
// import { ResponseItem } from '@common/types';

@Controller('workspace')
export class WorkspaceController {
	constructor(private readonly workspaceService: WorkspaceService) {}

	@Post()
	create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
		return this.workspaceService.create(createWorkspaceDto);
	}

	@Get()
	@Auth(ROLE.SUPER_ADMIN)
	findAll(@Query() pageOptionsDto: PageOptionsDto) {
		return this.workspaceService.findAll(pageOptionsDto);
	}

	@Get(':id')
	@Auth(ROLE.SUPER_ADMIN)
	async findOne(@Param('id') id: string) {
		return await this.workspaceService.findOne(+id);
	}

	@Get(':id/campaign')
	@Auth(ROLE.SUPER_ADMIN)
	findAllCampaign(
		@Param('id') id: string,
		@Query() pageOptionsDto: PageOptionsDto
	) {
		return this.workspaceService.findAllCampaign(+id, pageOptionsDto);
	}

	@Get(':id/user')
	@Auth(ROLE.SUPER_ADMIN)
	findAllUser(
		@Param('id') id: string,
		@Query() pageOptionsDto: PageOptionsDto
	) {
		return this.workspaceService.findAllUser(+id, pageOptionsDto);
	}

	@Patch('accept/:id')
	@Auth(ROLE.SUPER_ADMIN)
	accept(@Param('id') id: string) {
		return this.workspaceService.update(+id, {
			status: WORKSPACE_STATUS.ACCEPT,
		});
	}

	@Delete('reject/:id')
	@Auth(ROLE.SUPER_ADMIN)
	reject(@Param('id') id: string) {
		return this.workspaceService.remove(+id);
	}
}
