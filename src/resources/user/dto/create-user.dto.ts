import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { ROLE } from '@common/enums';
import { Campaign } from '@resources/campaign/entities/campaign.entity';
import { Workspace } from '@resources/workspace/entities/workspace.entity';

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

	roleName: ROLE;

	workspace?: Workspace;

	campaign?: Campaign[];
}
