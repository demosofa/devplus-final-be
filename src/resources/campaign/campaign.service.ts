import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity';
import { Repository } from 'typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CAMPAIGN_STATUS } from '@common/enums/campaign-status';
import { WorkspaceService } from '@resources/workspace/workspace.service';

@Injectable()
export class CampaignService {
	constructor(
		@InjectRepository(Campaign)
		private readonly campaignRepos: Repository<Campaign>,
		private readonly schedulerRegistry: SchedulerRegistry,
		private readonly workspaceService: WorkspaceService
	) {}
	async create(createCampaignDto: CreateCampaignDto) {
		try {
			const { workspaceId, ...campaignDto } = createCampaignDto;
			const workspace = await this.workspaceService.findOne(workspaceId);
			const campaign = this.campaignRepos.create({ ...campaignDto, workspace });
			const saveCompaign = await this.campaignRepos.save(campaign);
			this.expire(saveCompaign.id, saveCompaign.expired_time);
			return saveCompaign;
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	findAll() {
		return `This action returns all campaign`;
	}

	async findOne(id: number) {
		return await this.campaignRepos.findOneBy({ id });
	}

	async update(id: number, updateCampaignDto: UpdateCampaignDto) {
		const index = await this.findOne(id);
		if (!index) {
			throw new BadRequestException('Campaign not found');
		}
		this.expire(id, updateCampaignDto.expired);

		await this.campaignRepos.update(id, updateCampaignDto);
		return this.campaignRepos.save({ ...index, ...updateCampaignDto });
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
