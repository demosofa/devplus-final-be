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

			if (payload.status == USER_STATUS.DISABLE) {
				throw new Error(
					'Your account have been disabled, please contact to super admin'
				);
			}

			req.user = payload;

			return true;
		} catch (error) {
			throw new UnauthorizedException('There is no user');
		}
	}
}
