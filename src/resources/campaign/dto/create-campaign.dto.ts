import { IsNotEmpty } from 'class-validator';

export class CreateCampaignDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	description: string;

	@IsNotEmpty()
	expired_time: string;
}
