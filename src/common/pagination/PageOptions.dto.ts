import { Order } from '@common/enums/order';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PageOptionsDto {
	@IsString()
	@IsOptional()
	orderBy?: string;

	@IsEnum(Order)
	@IsOptional()
	order?: Order = Order.ASC;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@IsOptional()
	page?: number = 1;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(50)
	@IsOptional()
	take?: number = 5;

	get skip(): number {
		return (this.page - 1) * this.take;
	}
}
