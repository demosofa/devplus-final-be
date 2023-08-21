import {
	IsEmail,
	IsNotEmpty,
	IsString,
	IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	firstName: string;

	@IsNotEmpty()
	@IsString()
	lastName: string;

	@IsNotEmpty()
	@IsString()
	username: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsStrongPassword()
	password: string;
}
