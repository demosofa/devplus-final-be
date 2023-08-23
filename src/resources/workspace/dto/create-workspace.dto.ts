import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateWorkspaceDto {
	@IsNotEmpty()
	title_workspace: string;

	@IsNotEmpty()
	name: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	password: string;

	@IsNotEmpty()
	phone_number: string;
}
