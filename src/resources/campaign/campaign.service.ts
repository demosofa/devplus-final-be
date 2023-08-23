import { Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity';
import { Repository } from 'typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CAMPAIGN_STATUS } from '@common/enums/campaign-status';

@Injectable()
export class CampaignService {
	constructor(
		@InjectRepository(Campaign)
		private readonly campaignRepos: Repository<Campaign>,
		private readonly schedulerRegistry: SchedulerRegistry
	) {}
	create(createCampaignDto: CreateCampaignDto) {
		return 'This action adds a new campaign';
	}

	findAll() {
		return `This action returns all campaign`;
	}

	findOne(id: number) {
		return `This action returns a #${id} campaign`;
	}

	update(id: number, updateCampaignDto: UpdateCampaignDto) {
		return `This action updates a #${id} campaign`;
	}

	expire(id: number, at: string | Date) {
		const timeOutName = 'campaign-expire' + id;
		if (this.schedulerRegistry.getTimeouts().includes(timeOutName))
			this.schedulerRegistry.deleteTimeout(timeOutName);

		const milliseconds = new Date(at).getTime() - new Date().getTime();
		const timeout = setTimeout(async () => {
			await this.campaignRepos.update(id, { status: CAMPAIGN_STATUS.INACTIVE });
			this.schedulerRegistry.deleteTimeout(timeOutName);
		}, milliseconds);
		this.schedulerRegistry.addTimeout(timeOutName, timeout);
	}

	remove(id: number) {
		return `This action removes a #${id} campaign`;
	}
}
