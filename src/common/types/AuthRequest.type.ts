import { Request } from 'express';
import { User } from '@resources/user/entities/user.entity';

export interface AuthRequest extends Request {
	user: User;
}
