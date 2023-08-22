import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { WorksapaceService } from './worksapace.service';
import { CreateWorksapaceDto } from './dto/create-worksapace.dto';
import { UpdateWorksapaceDto } from './dto/update-worksapace.dto';

@Controller('worksapace')
export class WorksapaceController {
	constructor(private readonly worksapaceService: WorksapaceService) {}

	@Post()
	create(@Body() createWorksapaceDto: CreateWorksapaceDto) {
		return this.worksapaceService.create(createWorksapaceDto);
	}

	@Get()
	findAll() {
		return this.worksapaceService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.worksapaceService.findOne(+id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateWorksapaceDto: UpdateWorksapaceDto
	) {
		return this.worksapaceService.update(+id, updateWorksapaceDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.worksapaceService.remove(+id);
	}
}
