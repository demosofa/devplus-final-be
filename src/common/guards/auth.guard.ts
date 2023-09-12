import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthRequest, AuthToken } from '@common/types';
import { ROLE, USER_STATUS } from '@common/enums';
import { User } from '@resources/user/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		@InjectRepository(User) private userRepos: Repository<User>,
		private jwtService: JwtService,
		private configService: ConfigService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<AuthRequest>();

		const auth = req.headers.authorization;
		if (!auth) throw new UnauthorizedException('There is no authorization');

		const [type, token] = auth.split(' ');
		if (type != 'Bearer' || !token)
			throw new UnauthorizedException('There is no token available');

		try {
			const secret = this.configService.get('SECRET');
			const payload = await this.jwtService.verifyAsync<AuthToken>(token, {
				secret,
			});

			const user = await this.userRepos.findOne({
				where: { id: payload.id },
				relations: ['role', 'workspace', 'campaign'],
			});

			if (!user) throw new Error('This token is invalid');

			if (user.status == USER_STATUS.DISABLE) {
				let boss: User;
				if (user.role.name == ROLE.ADMIN) {
					boss = await this.userRepos.findOne({
						where: {
							role: {
								name: ROLE.SUPER_ADMIN,
							},
						},
						relations: ['role'],
					});
				} else if (user.role.name == ROLE.HR) {
					boss = await this.userRepos.findOne({
						where: {
							role: {
								name: ROLE.ADMIN,
							},
							workspace: {
								id: user.workspace.id,
							},
						},
						relations: ['role'],
					});
				}

				throw new Error(
					`Your account is disabled, pls contact to ${boss.role.name} via ${boss.email}`
				);
			}

			req.user = user;

			return true;
		} catch (error) {
			throw new UnauthorizedException(error.message);
		}
	}
}
