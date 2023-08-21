import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

export interface IAuthService {
	login(loginUserDto: LoginUserDto): Promise<string>;
	register(registerUserDto: RegisterUserDto): Promise<string>;
}

export const IAuthService = Symbol('IAuthService');
