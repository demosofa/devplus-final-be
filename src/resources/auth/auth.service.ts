import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthService } from './auth.interface';
import { LoginUserDto, RegisterUserDto } from './dto';
import { IUserService } from '../user/user.interface';
import { hashSync, compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements IAuthService {
	constructor(
		@Inject(IUserService) private userService: IUserService,
		private jwtService: JwtService
	) {}

	async login(loginUserDto: LoginUserDto) {
		const user = await this.userService.findOne(loginUserDto.username);
		if (!user) throw new UnauthorizedException();
		const { password, id, fullName, role } = user;
		const check = compareSync(loginUserDto.password, password);
		if (!check) throw new UnauthorizedException('Can not find the account');
		return this.jwtService.signAsync({ id, fullName, role: role.name });
	}

	async register(registerUserDto: RegisterUserDto) {
		registerUserDto.password = hashSync(registerUserDto.password, 10);
		const { id, fullName, role } = await this.userService.create(
			registerUserDto
		);
		return this.jwtService.signAsync({ id, fullName, role: role.name });
	}
}
