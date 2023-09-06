import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
} from '@nestjs/common';

import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { PageOptionsDto } from '@common/pagination/PageOptionDto';
import { Auth, ReqUser } from '@common/decorators';
import { User } from '@resources/user/entities/user.entity';
import { ROLE } from '@common/enums';

@Controller('campaign')
export class CampaignController {
	constructor(private readonly campaignService: CampaignService) {}

	@Post()
	@Auth(ROLE.ADMIN, ROLE.HR)
	create(@ReqUser() user: User, @Body() createCampaignDto: CreateCampaignDto) {
		return this.campaignService.create(user, createCampaignDto);
	}

	@Get()
	@Auth(ROLE.SUPER_ADMIN, ROLE.ADMIN, ROLE.HR)
	findAll(@Query() pageOptionsDto: PageOptionsDto) {
		return this.campaignService.findAll(pageOptionsDto);
	}

	@Get(':id')
	@Auth(ROLE.ADMIN, ROLE.HR)
	findOne(@Param('id') id: string) {
		return this.campaignService.findOne(+id);
	}

	@Patch(':id')
	@Auth(ROLE.ADMIN, ROLE.HR)
	update(
		@Param('id') id: string,
		@Body() updateCampaignDto: UpdateCampaignDto
	) {
		return this.campaignService.update(+id, updateCampaignDto);
	}

	@Delete(':id')
	@Auth(ROLE.ADMIN, ROLE.HR)
	remove(@Param('id') id: string) {
		return this.campaignService.remove(+id);
	}
}
