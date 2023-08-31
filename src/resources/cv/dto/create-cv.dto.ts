import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

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
	file: string;

	@IsNotEmpty()
	create_at: Date;

	@IsNotEmpty()
	status: string;

	@IsNotEmpty()
	campaignId: number;
}
