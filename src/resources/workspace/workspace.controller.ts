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
import { ResponseItem } from '@common/types';

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
	async findOne(@Param('id') id: string) {
		const result = await this.workspaceService.findOne(+id);
		return new ResponseItem(result, 'Successfully');
	}
	@Get(':id/campaign')
	findAllCampaign(
		@Param('id') id: string,
		@Query() pageOptionsDto: PageOptionsDto
	) {
		return this.workspaceService.findAllCampaign(+id, pageOptionsDto);
	}

	@Get(':id/user')
	findAllUser(
		@Param('id') id: string,
		@Query() pageOptionsDto: PageOptionsDto
	) {
		return this.workspaceService.findAllUser(+id, pageOptionsDto);
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
