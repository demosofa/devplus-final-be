import { Test, TestingModule } from '@nestjs/testing';
import { WorksapaceController } from './worksapace.controller';
import { WorksapaceService } from './worksapace.service';

describe('WorksapaceController', () => {
	let controller: WorksapaceController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [WorksapaceController],
			providers: [WorksapaceService],
		}).compile();

		controller = module.get<WorksapaceController>(WorksapaceController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
