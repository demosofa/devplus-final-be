import { Injectable } from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { PageOptionsDto } from '@common/pagination/PageOptionDto';
import { Cv } from './entities/cv.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from '@common/pagination/PageMetaDto';
import { PageDto } from '@common/pagination/Page.dto';

@Injectable()
export class CvService {
	constructor(
		@InjectRepository(Cv)
		private readonly cvRepos: Repository<Cv>
	) {}

	create(createCvDto: CreateCvDto) {
		return 'This action adds a new cv';
	}

	async findAll(pageOptionsDto: PageOptionsDto) {
		const findCv = this.cvRepos
			.createQueryBuilder('cv')
			.leftJoinAndSelect('cv.campaign', 'campaign')
			.orderBy('cv.name', pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await findCv.getCount();
		const { entities } = await findCv.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
	}

	findOne(id: number) {
		return `This action returns a #${id} cv`;
	}

	update(id: number, updateCvDto: UpdateCvDto) {
		return `This action updates a #${id} cv`;
	}

	remove(id: number) {
		return `This action removes a #${id} cv`;
	}
}
