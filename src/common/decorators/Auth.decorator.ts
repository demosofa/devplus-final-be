import { ROLE } from '@common/enums';
import { UseGuards, applyDecorators } from '@nestjs/common';
import { Roles } from './Roles.decorator';
import { AuthGuard, RoleGuard } from '@common/guards';

export const Auth = (...roles: ROLE[]) =>
	applyDecorators(Roles(...roles), UseGuards(AuthGuard, RoleGuard));
