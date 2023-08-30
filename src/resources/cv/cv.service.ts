import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { PageOptionsDto } from '@common/pagination/PageOptionDto';
import { Cv } from './entities/cv.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from '@common/pagination/PageMetaDto';
import { PageDto } from '@common/pagination/Page.dto';
import { SearchCvDto } from './dto/search-cv.dto';

@Injectable()
export class CvService {
	constructor(
		@InjectRepository(Cv)
		private readonly cvRepos: Repository<Cv>
	) {}

	create(createCvDto: CreateCvDto) {
		return 'This action adds a new cv';
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

	update(id: number, updateCvDto: UpdateCvDto) {
		return `This action updates a #${id} cv`;
	}

	remove(id: number) {
		return `This action removes a #${id} cv`;
	}
}
