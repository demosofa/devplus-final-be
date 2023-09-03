import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ROLE } from '@common/enums';

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	name: string;

	@IsOptional()
	password: string;

	@IsOptional()
	@IsString()
	phone_number: string;

	@IsOptional()
	@IsEnum(ROLE)
	roleName: ROLE;

	@IsOptional()
	@IsEmail()
	email: string;
}
