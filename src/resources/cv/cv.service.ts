import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { isURL } from 'class-validator';
import { promises as fs } from 'fs';

import { CreateCvDto } from './dto/create-cv.dto';
import { SearchCvDto } from './dto/search-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Cv } from './entities/cv.entity';
import { Campaign } from '@resources/campaign/entities/campaign.entity';
import { pagination } from '@common/pagination';
import { User } from '@resources/user/entities/user.entity';
import { ROLE } from '@common/enums';

@Injectable()
export class CvService {
	constructor(
		@InjectRepository(Cv)
		private readonly cvRepos: Repository<Cv>,
		@InjectRepository(Campaign)
		private readonly campaignRepos: Repository<Campaign>
	) {}

	async create(createCvDto: CreateCvDto) {
		try {
			const campaign = await this.campaignRepos.findOneBy({
				id: createCvDto.campaignId,
			});
			const cv = this.cvRepos.create(createCvDto);

			return this.cvRepos.save({
				...cv,
				campaign,
			});
		} catch (error) {
			if (!isURL(createCvDto.file)) {
				await fs.unlink(createCvDto.file);
			}
			throw new BadRequestException(error.message);
		}
	}

	async findAll(user: User, searchCvDto: SearchCvDto) {
		const findCv = this.cvRepos
			.createQueryBuilder('cv')
			.leftJoinAndSelect('cv.campaign', 'campaign')
			.leftJoinAndSelect('campaign.workspace', 'workspace')
			.orderBy('cv.id', searchCvDto.order);

		if (searchCvDto.search) {
			findCv.andWhere('(LOWER(campaign.name) ILIKE  LOWER(:search))', {
				search: `%${searchCvDto.search}%`,
			});
			findCv.andWhere('campaign.name ILIKE  :campaignName', {
				campaignName: `%${searchCvDto.search}%`,
			});
			findCv.orWhere('(LOWER(cv.status) ILIKE  LOWER(:search))', {
				search: `%${searchCvDto.search}%`,
			});
		}

		if (user.role.name === ROLE.ADMIN || user.role.name === ROLE.HR) {
			findCv.andWhere('workspace.id = :workspaceId', {
				workspaceId: user.workspace.id,
			});
		}

		return pagination(findCv, searchCvDto);
	}

	async findOne(id: number) {
		const findOneCv = await this.cvRepos.findOne({
			where: { id },
			relations: {
				campaign: true,
			},
		});
		if (!findOneCv) throw new NotFoundException('This cv is not existed');
		return findOneCv;
	}

	async update(id: number, updateCvDto: UpdateCvDto) {
		const oldCV = await this.cvRepos.findOne({
			where: { id },
		});

		return this.cvRepos.save({
			...oldCV,
			...updateCvDto,
		});
	}

	async updateFail(id: number, updateCvDto: UpdateCvDto) {
		const oldCV = await this.cvRepos.findOne({
			where: { id },
		});

		return this.cvRepos.save({
			...oldCV,
			...updateCvDto,
		});
	}

	async findCvByDashboard() {
		const CvMonth = await this.cvRepos
			.createQueryBuilder('cv')
			.select("DATE_TRUNC('month', cv.created_at) AS month, COUNT(*) AS count")
			.where('cv.created_at IS NOT NULL')
			.groupBy('month')
			.getRawMany();

		return CvMonth;
	}

	remove(id: number) {
		return `This action removes a #${id} cv`;
	}

	async totalCv(user: User) {
		if (user.role.name === ROLE.ADMIN) {
			const pastYear = new Date();
			pastYear.setFullYear(pastYear.getFullYear() - 1);
			const oldYearCount = await this.cvRepos
				.createQueryBuilder('cv')
				.leftJoinAndSelect('cv.campaign', 'campaign')
				.leftJoinAndSelect('campaign.workspace', 'workspace')
				.where('EXTRACT(YEAR FROM cv.created_at) = :pastYear', {
					pastYear: pastYear.getFullYear(),
				})
				.andWhere('workspace.id = :workspaceId', {
					workspaceId: user.workspace.id,
				})
				.getCount();

			const currentYearCount = await this.cvRepos
				.createQueryBuilder('cv')
				.leftJoinAndSelect('cv.campaign', 'campaign')
				.leftJoinAndSelect('campaign.workspace', 'workspace')
				.where('EXTRACT(YEAR FROM cv.created_at) = :currentYear', {
					currentYear: new Date().getFullYear(),
				})
				.andWhere('workspace.id = :workspaceId', {
					workspaceId: user.workspace.id,
				})
				.getCount();

			const totalCvCount = await this.cvRepos
				.createQueryBuilder('cv')
				.leftJoinAndSelect('cv.campaign', 'campaign')
				.leftJoinAndSelect('campaign.workspace', 'workspace')
				.where('workspace.id = :workspaceId', {
					workspaceId: user.workspace.id,
				})
				.getCount();

			return { oldYearCount, currentYearCount, totalCvCount };
		} else {
			const pastYear = new Date();
			pastYear.setFullYear(pastYear.getFullYear() - 1);
			const oldYearCount = await this.cvRepos
				.createQueryBuilder('cv')
				.where('EXTRACT(YEAR FROM cv.created_at) = :pastYear', {
					pastYear: pastYear.getFullYear(),
				})
				.getCount();

			const currentYearCount = await this.cvRepos
				.createQueryBuilder('cv')
				.where('EXTRACT(YEAR FROM cv.created_at) = :currentYear', {
					currentYear: new Date().getFullYear(),
				})
				.getCount();

			const totalCvCount = await this.cvRepos
				.createQueryBuilder('cv')

				.getCount();
			return { oldYearCount, currentYearCount, totalCvCount };
		}
	}
}
