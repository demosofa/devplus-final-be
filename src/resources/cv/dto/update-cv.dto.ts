import { IsEnum, IsOptional } from 'class-validator';
import { CV_STATUS } from '@common/enums/cv-status';

export class UpdateCvDto {
	@IsOptional()
	@IsEnum(CV_STATUS)
	status?: CV_STATUS;
}
