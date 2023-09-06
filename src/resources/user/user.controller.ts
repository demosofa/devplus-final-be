import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Delete,
	Param,
	UseGuards,
	Query,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@common/guards';
import { Auth, ReqUser } from '@common/decorators';
import { ROLE } from '@common/enums';
import { PageOptionsDto } from '@common/pagination/PageOptionDto';
import { Workspace } from '@resources/workspace/entities/workspace.entity';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('hr')
	@Auth(ROLE.ADMIN)
	createHR(
		@ReqUser('workspace') workspace: Workspace,
		@Body() createUserDto: CreateUserDto
	) {
		createUserDto.roleName = ROLE.HR;
		createUserDto.workspace = workspace;
		return this.userService.create(createUserDto);
	}

	@Get()
	@Auth(ROLE.SUPER_ADMIN, ROLE.ADMIN)
	findAll(@ReqUser() user: User, @Query() pageOptionsDto: PageOptionsDto) {
		return this.userService.findAll(user, pageOptionsDto);
	}

	@Get(':id')
	@UseGuards(AuthGuard)
	findById(@Param('id') id: number) {
		return this.userService.findById(id);
	}

	@Patch(':id')
	@Auth(ROLE.ADMIN)
	update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(id, updateUserDto);
	}

	@Delete(':id')
	@Auth(ROLE.ADMIN)
	remove(@Param('id') id: number) {
		return this.userService.remove(id);
	}
}
