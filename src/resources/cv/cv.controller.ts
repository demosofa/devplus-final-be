import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { PageOptionsDto } from '@common/pagination/PageOptionDto';

@Controller('cv')
export class CvController {
	constructor(private readonly cvService: CvService) {}

	@Post()
	create(@Body() createCvDto: CreateCvDto) {
		return this.cvService.create(createCvDto);
	}

	@Get()
	findAll(@Query() pageOptionsDto: PageOptionsDto) {
		return this.cvService.findAll(pageOptionsDto);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.cvService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateCvDto: UpdateCvDto) {
		return this.cvService.update(+id, updateCvDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.cvService.remove(+id);
	}
}
