import { IsNotEmpty } from 'class-validator';

export class UpdateWorkspaceDto {
	@IsNotEmpty()
	title_workspace: string;
}
