import { AuthUser } from '@common/types/AuthUser.type';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const ReqUser = createParamDecorator(
	(data: string, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest<Request & { user: AuthUser }>();
		return data ? req.user[data] : req.user;
	}
);
