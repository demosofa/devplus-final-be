import { WORKSPACE_STATUS } from '@common/enums';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateWorkspaceDto {
	@IsOptional()
	@IsNotEmpty()
	title_workspace: string;

	@IsOptional()
	@IsEnum(WORKSPACE_STATUS)
	status: WORKSPACE_STATUS;
}
