import { Module } from '@nestjs/common';
import { WorksapaceService } from './worksapace.service';
import { WorksapaceController } from './worksapace.controller';
import { Worksapace } from './entities/worksapace.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([Worksapace])],
	controllers: [WorksapaceController],
	providers: [WorksapaceService],
})
export class WorksapaceModule {}
