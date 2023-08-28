import { ROLE, USER_STATUS } from '@common/enums';

export type AuthToken = {
	id: number;
	name: string;
	email: string;
	status: USER_STATUS;
	role: ROLE;
};
