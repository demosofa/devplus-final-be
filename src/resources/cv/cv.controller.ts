import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { SearchCvDto } from './dto/search-cv.dto';
import { Auth, ReqUser } from '@common/decorators';
import { ROLE, CV_STATUS } from '@common/enums';
import { User } from '@resources/user/entities/user.entity';

@Controller('cv')
export class CvController {
	constructor(private readonly cvService: CvService) {}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	create(
		@UploadedFile() file: Express.Multer.File,
		@Body() createCvDto: CreateCvDto
	) {
		if (file) createCvDto.file = file.path;
		return this.cvService.create(createCvDto);
	}

	@Get()
	@Auth(ROLE.SUPER_ADMIN, ROLE.ADMIN)
	findAll(@ReqUser() user: User, @Query() searchCvDto: SearchCvDto) {
		return this.cvService.findAll(user, searchCvDto);
	}

	@Get('get-cv-count')
	@Auth(ROLE.ADMIN, ROLE.SUPER_ADMIN)
	totalCampaign(@ReqUser() user: User) {
		return this.cvService.totalCv(user);
	}

	@Get(':id')
	@Auth(ROLE.SUPER_ADMIN, ROLE.ADMIN)
	findOne(@Param('id') id: string) {
		return this.cvService.findOne(+id);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.cvService.remove(+id);
	}

	@Patch('pass/:id')
	@Auth(ROLE.ADMIN)
	pass(@Param('id') id: string) {
		return this.cvService.update(+id, {
			status: CV_STATUS.PASS,
		});
	}

	@Patch('fail/:id')
	@Auth(ROLE.ADMIN)
	fail(@Param('id') id: string) {
		return this.cvService.updateFail(+id, {
			status: CV_STATUS.FAIL,
		});
	}
}
