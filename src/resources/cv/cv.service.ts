import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { unlinkSync } from 'fs';

import { CreateCvDto } from './dto/create-cv.dto';
import { SearchCvDto } from './dto/search-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Cv } from './entities/cv.entity';
import { Campaign } from '@resources/campaign/entities/campaign.entity';
import { pagination } from '@common/pagination';

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
			if (createCvDto.file) {
				unlinkSync(createCvDto.file);
			}
			throw new BadRequestException(error.message);
		}
	}

	async findAll(searchCvDto: SearchCvDto) {
		const findCv = this.cvRepos
			.createQueryBuilder('cv')
			.leftJoinAndSelect('cv.campaign', 'campaign')
			.orderBy('cv.id', searchCvDto.order);

		if (searchCvDto.search) {
			findCv.andWhere('(LOWER(campaign.name) ILIKE  LOWER(:search))', {
				search: `%${searchCvDto.search}%`,
			});
			findCv.andWhere('campaign.name ILIKE  :campaignName', {
				campaignName: `%${searchCvDto.search}%`,
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
			.select("DATE_TRUNC('month', cv.create_at) AS month, COUNT(*) AS count")
			.where('cv.create_at IS NOT NULL')
			.groupBy('month')
			.getRawMany();

		return CvMonth;
	}

	remove(id: number) {
		return `This action removes a #${id} cv`;
	}
}
