import { ROLE } from '@common/enums';

export type AuthUser = {
	id: number;
	fullName: string;
	role: ROLE;
};
