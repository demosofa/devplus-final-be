import { PartialType } from '@nestjs/mapped-types';
import { PageOptionsDto } from '@common/pagination/PageOptionDto';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class SearchCvDto extends PartialType(PageOptionsDto) {
	@Type(() => String)
	@IsOptional()
	readonly search?: string;

	@Type(() => String)
	@IsOptional()
	readonly status?: string;
}
