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
import { PageOptionsDto } from '../../common/pagination/PageOptionDto';
import { ReqUser } from '@common/decorators';

@Controller('campaign')
export class CampaignController {
	constructor(private readonly campaignService: CampaignService) {}

	@Post()
	create(
		@ReqUser('id') userId: number,
		@Body() createCampaignDto: CreateCampaignDto
	) {
		return this.campaignService.create(userId, createCampaignDto);
	}

	@Get()
	findAll(@Query() pageOptionsDto: PageOptionsDto) {
		return this.campaignService.findAll(pageOptionsDto);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.campaignService.findOne(+id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateCampaignDto: UpdateCampaignDto
	) {
		return this.campaignService.update(+id, updateCampaignDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.campaignService.remove(+id);
	}
}
