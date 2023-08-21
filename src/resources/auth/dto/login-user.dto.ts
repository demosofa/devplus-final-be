import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class LoginUserDto {
	@IsNotEmpty()
	@IsString()
	username: string;

	@IsNotEmpty()
	@IsStrongPassword()
	password: string;
}
