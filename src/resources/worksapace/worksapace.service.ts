import { Injectable } from '@nestjs/common';
import { CreateWorksapaceDto } from './dto/create-worksapace.dto';
import { UpdateWorksapaceDto } from './dto/update-worksapace.dto';

@Injectable()
export class WorksapaceService {
	create(createWorksapaceDto: CreateWorksapaceDto) {
		return 'This action adds a new worksapace';
	}

	findAll() {
		return `This action returns all worksapace`;
	}

	findOne(id: number) {
		return `This action returns a #${id} worksapace`;
	}

	update(id: number, updateWorksapaceDto: UpdateWorksapaceDto) {
		return `This action updates a #${id} worksapace`;
	}

	remove(id: number) {
		return `This action removes a #${id} worksapace`;
	}
}
