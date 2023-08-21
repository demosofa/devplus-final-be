import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from './entities/role.entity';
import { User } from '@resources/user/entities/user.entity';
import { UserModule } from '@resources/user/user.module';
import { UserService } from '@resources/user/user.service';

@Module({
	imports: [TypeOrmModule.forFeature([Role, User]), UserModule],
	controllers: [RoleController],
	providers: [RoleService, UserService],
	exports: [RoleService],
})
export class RoleModule {}
