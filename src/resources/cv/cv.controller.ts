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
import { PageOptionsDto } from '@common/pagination/PageOptionDto';
import { SearchCvDto } from './dto/search-cv.dto';
import { CV_STATUS } from '../../common/enums/cv-status';

@Controller('cv')
export class CvController {
	constructor(private readonly cvService: CvService) {}

	@Post()
	create(@Body() createCvDto: CreateCvDto) {
		return this.cvService.create(createCvDto);
	}

	@Get()
	findAll(@Query() searchCvDto: SearchCvDto) {
		return this.cvService.findAll(searchCvDto);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.cvService.findOne(+id);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.cvService.remove(+id);
	}

	@Patch('pass/:id')
	// @Auth(ROLE.ADMIN)
	pass(@Param('id') id: string) {
		return this.cvService.update(+id, {
			status: CV_STATUS.PASS,
		});
	}

	@Patch('fail/:id')
	fail(@Param('id') id: string) {
		return this.cvService.updateFail(+id, {
			status: CV_STATUS.FAIL,
		});
	}
}
