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
import { CAMPAIGN_STATUS } from '@common/enums/campaign-status';
import { PageOptionsDto } from '@common/pagination/PageOptions.dto';
import { User } from '@resources/user/entities/user.entity';
import { ROLE } from '@common/enums';
import { pagination } from '@common/pagination';

@Injectable()
export class CampaignService {
	constructor(
		@InjectRepository(Campaign)
		private readonly campaignRepos: Repository<Campaign>,
		private readonly schedulerRegistry: SchedulerRegistry
	) {}

	async create(user: User, createCampaignDto: CreateCampaignDto) {
		try {
			const campaign = this.campaignRepos.create({
				...createCampaignDto,
				workspace: user.workspace,
				user,
			});
			const savedCampaign = await this.campaignRepos.save(campaign);

			this.expire(savedCampaign.id, savedCampaign.expired_time);

			return savedCampaign;
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	async findAll(user: User, pageOptionsDto: PageOptionsDto) {
		const queryBuilder = this.campaignRepos
			.createQueryBuilder('campaign')
			.leftJoinAndSelect('campaign.workspace', 'workspace')
			.orderBy('campaign.id', pageOptionsDto.order);

		if (user.role.name === ROLE.ADMIN || user.role.name === ROLE.HR) {
			queryBuilder.where('workspace.id = :workspaceId', {
				workspaceId: user.workspace.id,
			});
		}

		return pagination(queryBuilder, pageOptionsDto);
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

	async remove(id: number) {
		const campaign = await this.campaignRepos.findOne({
			where: { id },
			relations: {
				cv: true,
			},
		});

		if (!campaign) {
			throw new NotFoundException(`Campaign with ID ${id} not found`);
		}

		await this.campaignRepos.remove(campaign);
	}

	async getCvCountByTimePeriod(
		user: User,
		filterTime: 'month' | 'week' | 'year'
	) {
		const startFilterDate = new Date();

		const cvCountByTimePeriod = this.campaignRepos
			.createQueryBuilder('campaign')
			.leftJoin('campaign.cv', 'cv')
			.leftJoin('campaign.workspace', 'workspace')
			.select([
				'campaign.id as campaign_id',
				'campaign.name AS campaign_name',
				"TO_CHAR(cv.created_at, 'YYYY-MM-DD') AS date",
			])
			.addSelect('COUNT(cv.id) AS cv_counts')
			.where('workspace.id = :adminWorkspaceId', {
				adminWorkspaceId: user.workspace.id,
			})
			.groupBy('campaign_id')
			.addGroupBy('date');

		if (filterTime == 'year') {
			startFilterDate.setDate(startFilterDate.getDate() - 365);
		} else if (filterTime == 'month') {
			startFilterDate.setDate(startFilterDate.getDate() - 30);
		} else if (filterTime == 'week') {
			startFilterDate.setDate(startFilterDate.getDate() - 7);
		}

		cvCountByTimePeriod.andWhere('cv.created_at >= :startFilterDate', {
			startFilterDate,
		});

		return cvCountByTimePeriod.getRawMany();
	}
}
