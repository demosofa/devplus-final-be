import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthUser } from '../types/AuthUser.type';
import { ROLE } from '../enums';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const roles = this.reflector.get<ROLE[]>('roles', context.getHandler());
		if (!roles) return true;

		const req = context
			.switchToHttp()
			.getRequest<Request & { user: AuthUser }>();
		if (roles.includes(req.user.role)) return true;
		return false;
	}
}
