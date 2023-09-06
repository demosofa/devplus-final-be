import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';

import { CreateUserDto } from './create-user.dto';
import { USER_STATUS } from '@common/enums';

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@IsOptional()
	status: USER_STATUS;
}
