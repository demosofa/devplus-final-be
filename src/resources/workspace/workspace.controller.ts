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

import { FILTER_TIME, ROLE, WORKSPACE_STATUS } from '@common/enums';
import { PageOptionsDto } from '@common/pagination/PageOptions.dto';
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

	@Get('campaign-count')
	@Auth(ROLE.SUPER_ADMIN)
	countCampaignByTimePeriod(@Query('filterTime') filterTime?: FILTER_TIME) {
		if (!filterTime) filterTime = FILTER_TIME.YEAR;
		return this.workspaceService.countCampaignByTimePeriod(filterTime);
	}

	@Get('user-count')
	@Auth(ROLE.SUPER_ADMIN)
	countUserByTimePeriod(@Query('filterTime') filterTime?: FILTER_TIME) {
		if (!filterTime) filterTime = FILTER_TIME.YEAR;
		return this.workspaceService.countUserByTimePeriod(filterTime);
	}

	@Get(':id')
	@Auth(ROLE.SUPER_ADMIN)
	async findOne(@Param('id') id: string) {
		return await this.workspaceService.findOne(+id);
	}

	@Get(':id/campaign')
	@Auth(ROLE.ADMIN, ROLE.HR)
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
