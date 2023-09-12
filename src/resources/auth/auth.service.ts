import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { IAuthService } from './auth.interface';
import { LoginUserDto, RegisterUserDto } from './dto';
import { IUserService } from '../user/user.interface';
import { ROLE, USER_STATUS } from '@common/enums';
import { User } from '@resources/user/entities/user.entity';

@Injectable()
export class AuthService implements IAuthService {
	constructor(
		@Inject(IUserService) private userService: IUserService,
		private jwtService: JwtService
	) {}

	async login(loginUserDto: LoginUserDto) {
		const user = await this.userService.findOne({ email: loginUserDto.email });
		if (!user) throw new UnauthorizedException();

		const { id, email, name, password, role, status } = user;

		if (status == USER_STATUS.DISABLE) {
			let boss: User;
			if (user.role.name == ROLE.ADMIN) {
				boss = await this.userService.findOne({
					role: {
						name: ROLE.SUPER_ADMIN,
					},
				});
			} else if (user.role.name == ROLE.HR) {
				boss = await this.userService.findOne({
					role: {
						name: ROLE.ADMIN,
					},
					workspace: {
						id: user.workspace.id,
					},
				});
			}

			throw new UnauthorizedException(
				`Your account is disabled, pls contact to ${boss.role.name} via ${boss.email}`
			);
		}

		const check = await compare(loginUserDto.password, password);
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
		const { id, email, name, role, status } = await this.userService.create({
			...registerUserDto,
			roleName: ROLE.SUPER_ADMIN,
		});

		return this.jwtService.signAsync({
			id,
			name,
			email,
			role: role.name,
			status,
		});
	}
}
