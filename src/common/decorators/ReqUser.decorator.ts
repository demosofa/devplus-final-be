import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { AuthRequest } from '@common/types';

export const ReqUser = createParamDecorator(
	(data: string, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest<AuthRequest>();
		return data ? req.user[data] : req.user;
	}
);
