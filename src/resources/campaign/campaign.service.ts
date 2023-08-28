import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';

import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaign } from './entities/campaign.entity';
import { WorkspaceService } from '@resources/workspace/workspace.service';
import { CAMPAIGN_STATUS } from '@common/enums/campaign-status';
import { PageOptionsDto } from '../../common/pagination/PageOptionDto';
import { PageMetaDto } from '../../common/pagination/PageMetaDto';
import { PageDto } from '../../common/pagination/Page.dto';
import { User } from '@resources/user/entities/user.entity';

@Injectable()
export class CampaignService {
	constructor(
		@InjectRepository(Campaign)
		private readonly campaignRepos: Repository<Campaign>,
		private readonly schedulerRegistry: SchedulerRegistry,
		private readonly workspaceService: WorkspaceService
	) {}

	async create(user: User, createCampaignDto: CreateCampaignDto) {
		try {
			const { workspaceId, ...campaignDto } = createCampaignDto;
			const workspace = await this.workspaceService.findOne(workspaceId);

			const campaign = this.campaignRepos.create({
				...campaignDto,
				workspace,
				user,
			});
			const savedCampaign = await this.campaignRepos.save(campaign);

			this.expire(savedCampaign.id, savedCampaign.expired_time);

			return savedCampaign;
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	async findAll(pageOptionsDto: PageOptionsDto) {
		const queryBuilder = this.campaignRepos
			.createQueryBuilder('campaign')
			.leftJoinAndSelect('campaign.workspace', 'workspace')
			.orderBy('campaign.name', pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
	}

	async findOne(id: number) {
		const isExist = await this.campaignRepos.findOneBy({ id });
		if (!isExist) throw new NotFoundException('This campaign does not exist');

		return isExist;
	}

	async update(id: number, updateCampaignDto: UpdateCampaignDto) {
		const oldCampaign = await this.findOne(id);

		try {
			const updatedCampaign = await this.campaignRepos.save({
				...oldCampaign,
				...updateCampaignDto,
			});

			this.expire(id, updateCampaignDto.expired_time);

			return updatedCampaign;
		} catch (error) {
			throw new InternalServerErrorException(error.message);
		}
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
