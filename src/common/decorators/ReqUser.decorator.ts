import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { AuthRequest } from '@common/types';
import { User } from '@resources/user/entities/user.entity';

export const ReqUser = createParamDecorator(
	async (data: keyof User, ctx: ExecutionContext) => {
		const { user } = ctx.switchToHttp().getRequest<AuthRequest>();
		return data ? user[data] : user;
	}
);
