import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
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

	async findOne(id: number) {
		const isExist = await this.workspaceRepos.findOne({
			where: { id, campaign: true },
		});
		if (isExist) return isExist;
		throw new NotFoundException('This workspace is not existed');
	}

	async update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
		const oldWorkspace = await this.findOne(id);

		if (oldWorkspace.title_workspace == updateWorkspaceDto.title_workspace) {
			return oldWorkspace;
		}

		const isExist = await this.workspaceRepos.findOne({
			where: {
				title_workspace: updateWorkspaceDto.title_workspace,
			},
		});
		if (isExist)
			throw new BadRequestException('This workspace is already existed');

		return this.workspaceRepos.save({
			id,
			...oldWorkspace,
			...updateWorkspaceDto,
		});
	}

	remove(id: number) {
		return `This action removes a #${id} workspace`;
	}
}
