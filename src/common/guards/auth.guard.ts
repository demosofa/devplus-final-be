import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthUser } from '@common/types/AuthUser.type';
import { UserService } from '@resources/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
		private userService: UserService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context
			.switchToHttp()
			.getRequest<Request & { user: AuthUser }>();

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

			const result = await this.userService.findById(payload.id);
			if (!result || result.role.name != payload.role)
				throw new Error('There is no user');

			req.user = payload;

			return true;
		} catch (error) {
			throw new UnauthorizedException(error.message);
		}
	}
}
