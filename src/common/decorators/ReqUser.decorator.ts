import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

import { User } from '@resources/user/entities/user.entity';

export const ReqUser = createParamDecorator(
	(data: string, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest<Request & { user: User }>();
		return data ? req.user[data] : req.user;
	}
);
