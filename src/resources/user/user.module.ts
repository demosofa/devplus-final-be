import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Role } from '@resources/role/entities/role.entity';
import { RoleModule } from '@resources/role/role.module';
import { RoleService } from '@resources/role/role.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Role]),
		forwardRef(() => RoleModule),
	],
	controllers: [UserController],
	providers: [UserService, RoleService],
	exports: [UserService],
})
export class UserModule {}
