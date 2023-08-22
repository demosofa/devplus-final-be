import { Test, TestingModule } from '@nestjs/testing';
import { WorksapaceService } from './worksapace.service';

describe('WorksapaceService', () => {
	let service: WorksapaceService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [WorksapaceService],
		}).compile();

		service = module.get<WorksapaceService>(WorksapaceService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
