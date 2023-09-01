import { ROLE } from '@common/enums';
import { Campaign } from '@resources/campaign/entities/campaign.entity';
import { Workspace } from '@resources/workspace/entities/workspace.entity';
import {
	IsArray,
	IsEmail,
	IsEnum,
	IsInstance,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	password: string;

	@IsNotEmpty()
	@IsString()
	phone_number: string;

	@IsEnum(ROLE)
	roleName: ROLE;

	@IsOptional()
	@IsInstance(Workspace)
	workspace?: Workspace;

	@IsOptional()
	@IsArray()
	campaign?: Campaign[];
}
