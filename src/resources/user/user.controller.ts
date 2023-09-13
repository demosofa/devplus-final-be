import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';

import { Auth, ReqUser } from '@common/decorators';
import { ROLE } from '@common/enums';
import { AuthGuard } from '@common/guards';
import { Workspace } from '@resources/workspace/entities/workspace.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

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
	findAll(@ReqUser() user: User, @Query() searchUserDto: SearchUserDto) {
		return this.userService.findAll(user, searchUserDto);
	}

	@Get('get-user-count')
	@Auth(ROLE.ADMIN, ROLE.SUPER_ADMIN)
	totalUser(@ReqUser() user: User) {
		return this.userService.totalUser(user);
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
