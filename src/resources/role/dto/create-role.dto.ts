import { ROLE } from '@common/enums';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
	@IsNotEmpty()
	@IsEnum(ROLE)
	name: ROLE;
}
