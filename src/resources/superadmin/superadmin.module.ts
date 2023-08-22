import { Module } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { SuperadminController } from './superadmin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Superadmin } from './entities/superadmin.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Superadmin])],
	controllers: [SuperadminController],
	providers: [SuperadminService],
})
export class SuperadminModule {}
