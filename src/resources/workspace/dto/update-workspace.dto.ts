import { WORKSPACE_STATUS } from '@common/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateWorkspaceDto {
	@IsOptional()
	@IsString()
	title_workspace?: string;

	@IsOptional()
	@IsEnum(WORKSPACE_STATUS)
	status?: WORKSPACE_STATUS;
}
