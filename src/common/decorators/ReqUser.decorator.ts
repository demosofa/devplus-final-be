import {
	ExecutionContext,
	InternalServerErrorException,
	createParamDecorator,
} from '@nestjs/common';

import { AuthRequest } from '@common/types';
import { User } from '@resources/user/entities/user.entity';

export const ReqUser = createParamDecorator(
	async (data: keyof User, ctx: ExecutionContext) => {
		try {
			const { user } = ctx.switchToHttp().getRequest<AuthRequest>();

			const result = await User.findOne({
				where: { id: user.id },
				relations: ['role', 'workspace', 'campaign'],
			});

			return data ? result?.[data] : result;
		} catch (error) {
			throw new InternalServerErrorException(error.message);
		}
	}
);
