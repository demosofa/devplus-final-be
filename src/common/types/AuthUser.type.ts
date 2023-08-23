import { ROLE, USER_STATUS } from '@common/enums';

export type AuthUser = {
	id: number;
	name: string;
	email: string;
	status: USER_STATUS;
	role: ROLE;
};
