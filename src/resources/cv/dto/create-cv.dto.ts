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
	create_at: Date;

	@IsNotEmpty()
	status: string;

	@IsNotEmpty()
	campaignId: number;
}
