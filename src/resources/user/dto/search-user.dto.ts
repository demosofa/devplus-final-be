import { PageOptionsDto } from '@common/pagination/PageOptions.dto';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class SearchUserDto extends PageOptionsDto {
	@Type(() => String)
	@IsOptional()
	readonly search?: string;

	@Type(() => String)
	@IsOptional()
	readonly status?: string;
}
