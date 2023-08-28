import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { ROLE } from '../enums';
import { AuthRequest } from '@common/types';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const roles = this.reflector.get<ROLE[]>('roles', context.getHandler());
		if (!roles) return true;

		const req = context.switchToHttp().getRequest<AuthRequest>();

		if (roles.includes(req.user.role.name)) return true;
		return false;
	}
}
