import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { unlinkSync } from 'fs';

import { PageDto } from '@common/pagination/Page.dto';
import { PageMetaDto } from '@common/pagination/PageMetaDto';
import { PageOptionsDto } from '@common/pagination/PageOptionDto';
import { Role } from '../role/entities/role.entity';
import { User } from '../user/entities/user.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { SearchCvDto } from './dto/search-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Cv } from './entities/cv.entity';
import { Campaign } from '@resources/campaign/entities/campaign.entity';

@Injectable()
export class CvService {
	constructor(
		@InjectRepository(Cv)
		private readonly cvRepos: Repository<Cv>,
		@InjectRepository(User)
		private readonly userRepos: Repository<User>,
		@InjectRepository(Role)
		private readonly roleRepos: Repository<Role>
	) {}

	async create(createCvDto: CreateCvDto) {
		try {
			const campaign = await Campaign.findOneBy({
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
			.orderBy('cv.name', searchCvDto.order)
			.skip(searchCvDto.skip)
			.take(searchCvDto.take);

		if (searchCvDto.search) {
			findCv.andWhere('(LOWER(campaign.name) LIKE LOWER(:search))', {
				search: `%${searchCvDto.search}%`,
			});
		}

		const itemCount = await findCv.getCount();
		const { entities } = await findCv.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({
			itemCount,
			pageOptionsDto: searchCvDto as PageOptionsDto,
		});

		return new PageDto(entities, pageMetaDto);
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

	remove(id: number) {
		return `This action removes a #${id} cv`;
	}
}
