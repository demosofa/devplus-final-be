import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Delete,
	Param,
	UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@common/guards';
import { Auth } from '@common/decorators';
import { ROLE } from '@common/enums';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@Get(':id')
	findById(@Param('id') id: string) {
		return this.userService.findById(id);
	}

	@Patch(':id')
	@UseGuards(AuthGuard)
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(id, updateUserDto);
	}

	@Delete(':id')
	@Auth(ROLE.ADMIN)
	remove(@Param('id') id: string) {
		return this.userService.remove(id);
	}
}
