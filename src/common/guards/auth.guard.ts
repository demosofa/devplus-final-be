import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthUser } from '@common/types';
import { USER_STATUS } from '@common/enums';
import { User } from '@resources/user/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		@InjectRepository(User) private useRepos: Repository<User>,
		private jwtService: JwtService,
		private configService: ConfigService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<Request & { user: User }>();

		const auth = req.headers.authorization;
		if (!auth) throw new UnauthorizedException('There is no authorization');

		const [type, token] = auth.split(' ');
		if (type != 'Bearer' || !token)
			throw new UnauthorizedException('There is no token available');

		try {
			const secret = this.configService.get('SECRET');
			const payload = await this.jwtService.verifyAsync<AuthUser>(token, {
				secret,
			});

			const user = await this.useRepos.findOne({
				where: { id: payload.id },
				relations: {
					role: true,
				},
			});

			if (!user || user.role.name != payload.role)
				throw new Error('There is no user');
			else if (user.status == USER_STATUS.DISABLE)
				throw new Error(
					'Your account have been disabled, please contact to super admin'
				);

			req.user = user;

			return true;
		} catch (error) {
			throw new UnauthorizedException(error.message);
		}
	}
}
