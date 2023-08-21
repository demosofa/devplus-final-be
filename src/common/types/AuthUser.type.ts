import { ROLE } from '@common/enums';

export type AuthUser = {
	id: string;
	fullName: string;
	role: ROLE;
};
