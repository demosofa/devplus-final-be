import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { PageOptionsDto } from '@common/pagination/PageOptionDto';
import { Cv } from './entities/cv.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from '@common/pagination/PageMetaDto';
import { PageDto } from '@common/pagination/Page.dto';
import { CV_STATUS } from '../../common/enums/cv-status';
import { ROLE, USER_STATUS } from '../../common/enums';
import { User } from '../user/entities/user.entity';
import { Role } from '../role/entities/role.entity';

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

	async findOne(id: number) {
		return `This action returns a #${id} cv`;
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
