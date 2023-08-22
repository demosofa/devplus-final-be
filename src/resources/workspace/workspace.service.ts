import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspaceService {
	constructor(
		@InjectRepository(Workspace) private workspaceRepos: Repository<Workspace>
	) {}
	create(createWorkspaceDto: CreateWorkspaceDto) {
		return 'This action adds a new workspace';
	}

	async findAll() {
		return await this.workspaceRepos.find();
	}

	findOne(id: number) {
		return `This action returns a #${id} workspace`;
	}

	update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
		return `This action updates a #${id} workspace`;
	}

	remove(id: number) {
		return `This action removes a #${id} workspace`;
	}
}
