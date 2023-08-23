import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class LoginUserDto {
	@IsNotEmpty()
	@IsString()
	email: string;

	@IsNotEmpty()
	@IsStrongPassword()
	password: string;
}
