import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCvDto {
	@IsOptional()
	name: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	phone_number: string;

	@IsNotEmpty()
	apply_position: string;

	@IsOptional()
	@IsString()
	file: string;

	@IsNotEmpty()
	@Type(() => Number)
	campaignId: number;
}
