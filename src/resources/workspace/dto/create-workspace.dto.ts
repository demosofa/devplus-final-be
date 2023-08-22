import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateWorkspaceDto {
	@IsNotEmpty()
	title_workspace: string;

	@IsEmail()
	@IsNotEmpty()
	admin_email: string;

	@IsNotEmpty()
	admin_password: string;
}
