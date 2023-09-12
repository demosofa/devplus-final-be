import { Request } from 'express';
import { ROLE, USER_STATUS } from '@common/enums';
import { User } from '@resources/user/entities/user.entity';

export type AuthToken = {
	id: number;
	name: string;
	email: string;
	status: USER_STATUS;
	role: ROLE;
};

export interface AuthRequest extends Request {
	user: User;
}
