import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { IAuthService } from './auth.interface';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '@resources/role/entities/role.entity';
import { User } from '@resources/user/entities/user.entity';
import { RoleModule } from '@resources/role/role.module';
import { UserModule } from '@resources/user/user.module';
import { IUserService } from '@resources/user/user.interface';
import { UserService } from '@resources/user/user.service';
import { RoleService } from '@resources/role/role.service';

@Module({
	imports: [TypeOrmModule.forFeature([Role, User]), RoleModule, UserModule],
	controllers: [AuthController],
	providers: [
		{ useClass: AuthService, provide: IAuthService },
		{ useClass: UserService, provide: IUserService },
		RoleService,
	],
})
export class AuthModule {}
