import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateCampaignDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	description: string;

	@IsNotEmpty()
	expired_time: string;

	@IsNotEmpty()
	@Type(() => Number)
	workspaceId: number;
}
