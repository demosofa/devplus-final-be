import {
	BadRequestException,
	Injectable,
	NotFoundException,
	InternalServerErrorException,
} from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { Repository } from 'typeorm';
import { User } from '@resources/user/entities/user.entity';
import { Role } from '@resources/role/entities/role.entity';
import { ROLE } from '@common/enums';

@Injectable()
export class WorkspaceService {
	constructor(
		@InjectRepository(Workspace) private workspaceRepos: Repository<Workspace>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Role)
		private readonly roleRepos: Repository<Role>
	) {}

	async create(createWorkspaceDto: CreateWorkspaceDto): Promise<Workspace> {
		const { title_workspace, ...createAdminDto } = createWorkspaceDto;
		const isExist = await this.workspaceRepos.findOneBy({ title_workspace });

		if (isExist) throw new BadRequestException('Title is already exist!');

		const workspace = this.workspaceRepos.create({ title_workspace });
		try {
			const isAdminExist = await this.userRepository.findOneBy({
				email: createAdminDto.email,
			});
			if (isAdminExist)
				throw new BadRequestException(
					'There is already existed admin with this email'
				);
			let role = await this.roleRepos.findOneBy({ name: ROLE.ADMIN });
			if (!role) {
				const roleAdmin = this.roleRepos.create({ name: ROLE.ADMIN });
				role = await this.roleRepos.save(roleAdmin);
			}
			const createdWorkspace = await this.workspaceRepos.save(workspace);

			const admin = this.userRepository.create({
				...createAdminDto,
				role,
				workspace: createdWorkspace,
			});
			await this.userRepository.save(admin);

			return createdWorkspace;
		} catch (error) {
			throw new InternalServerErrorException(error.message);
		}
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

		if (updateWorkspaceDto.title_workspace) {
			if (oldWorkspace.title_workspace == updateWorkspaceDto.title_workspace) {
				return oldWorkspace;
			}

			const isExist = await this.workspaceRepos.findOne({
				where: {
					title_workspace: updateWorkspaceDto.title_workspace,
				},
			});
			if (isExist) {
				throw new BadRequestException('This workspace is already existed');
			}
		}

		return this.workspaceRepos.save({
			id,
			...oldWorkspace,
			...updateWorkspaceDto,
		});
	}

	async remove(id: number) {
		const workspace = await this.workspaceRepos.findOne({
			where: { id },
			relations: {
				user: true,
			},
		});

		if (!workspace) {
			throw new NotFoundException(`Workspace with ID ${id} not found`);
		}

		await this.workspaceRepos.remove(workspace);
	}
}
