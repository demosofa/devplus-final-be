import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignDto } from './create-campaign.dto';
import { IsEmpty } from 'class-validator';

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {
	@IsEmpty()
	workspaceId?: number;
}
