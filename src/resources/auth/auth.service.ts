import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { IAuthService } from './auth.interface';
import { LoginUserDto, RegisterUserDto } from './dto';
import { IUserService } from '../user/user.interface';

@Injectable()
export class AuthService implements IAuthService {
	constructor(
		@Inject(IUserService) private userService: IUserService,
		private jwtService: JwtService
	) {}

	async login(loginUserDto: LoginUserDto) {
		const user = await this.userService.findOne(loginUserDto.email);
		if (!user) throw new UnauthorizedException();

		const { id, email, name, password, role, status } = user;

		const check = await bcrypt.compare(loginUserDto.password, password);
		if (!check) throw new UnauthorizedException('Can not find the account');

		return this.jwtService.signAsync({
			id,
			name,
			email,
			role: role.name,
			status,
		});
	}

	async register(registerUserDto: RegisterUserDto) {
		const { id, email, name, role, status } = await this.userService.create(
			registerUserDto
		);

		return this.jwtService.signAsync({
			id,
			name,
			email,
			role: role.name,
			status,
		});
	}
}
