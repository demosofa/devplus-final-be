import { Repository } from 'typeorm';
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';

import { Role } from '@resources/role/entities/role.entity';
import { User } from '@resources/user/entities/user.entity';
import { PageOptionsDto } from '@common/pagination/PageOptions.dto';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Workspace } from './entities/workspace.entity';
import { ROLE, USER_STATUS, WORKSPACE_STATUS } from '@common/enums';
import { Campaign } from '@resources/campaign/entities/campaign.entity';
import { pagination } from '@common/pagination';

@Injectable()
export class WorkspaceService {
	constructor(
		@InjectRepository(Workspace) private workspaceRepos: Repository<Workspace>,
		@InjectRepository(User)
		private readonly userRepos: Repository<User>,
		@InjectRepository(Role)
		private readonly roleRepos: Repository<Role>,
		@InjectRepository(Campaign)
		private readonly campaignRepos: Repository<Campaign>
	) {}

	async create(createWorkspaceDto: CreateWorkspaceDto): Promise<Workspace> {
		const { title_workspace, ...createAdminDto } = createWorkspaceDto;
		const isExist = await this.workspaceRepos.findOneBy({ title_workspace });

		if (isExist) throw new BadRequestException('Title is already exist!');

		const workspace = this.workspaceRepos.create({ title_workspace });
		try {
			const isAdminExist = await this.userRepos.findOneBy({
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

			createAdminDto.password = await hash(createAdminDto.password, 10);

			const admin = this.userRepos.create({
				...createAdminDto,
				status: USER_STATUS.DISABLE,
				role,
				workspace: createdWorkspace,
			});

			await this.userRepos.save(admin);

			return createdWorkspace;
		} catch (error) {
			throw new InternalServerErrorException(error.message);
		}
	}

	async findAll(pageOptionsDto: PageOptionsDto) {
		const queryBuilder = this.workspaceRepos
			.createQueryBuilder('workspace')
			.orderBy('workspace.id', pageOptionsDto.order);

		return pagination(queryBuilder, pageOptionsDto);
	}

	async findOne(id: number) {
		const isExist = await this.workspaceRepos.findOne({
			where: { id },
		});
		if (!isExist) throw new NotFoundException('This workspace is not existed');
		return isExist;
	}

	async findAllCampaign(id: number, pageOptionsDto: PageOptionsDto) {
		const campaignQueryBuilder = this.campaignRepos
			.createQueryBuilder('campaign')
			.select([
				'campaign.id',
				'campaign.name',
				'campaign.description',
				'campaign.expired_time',
				'campaign.status',
			])
			.innerJoin('campaign.workspace', 'workspace')
			.orderBy('campaign.id', pageOptionsDto.order)
			.where('workspace.id = :id', { id });

		return pagination(campaignQueryBuilder, pageOptionsDto);
	}

	async findAllUser(id: number, pageOptionsDto: PageOptionsDto) {
		const userQueryBuilder = this.userRepos
			.createQueryBuilder('user')
			.select([
				'user.id',
				'user.name',
				'user.email',
				'user.phone_number',
				'user.status',
			])
			.innerJoin('user.workspace', 'workspace')
			.orderBy('user.name', pageOptionsDto.order)
			.where('workspace.id = :id', { id });

		return pagination(userQueryBuilder, pageOptionsDto);
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

		if (updateWorkspaceDto.status == WORKSPACE_STATUS.ACCEPT) {
			const roleAdmin = await this.roleRepos.findOneBy({ name: ROLE.ADMIN });
			const admin = await this.userRepos.findOneBy({
				role: {
					id: roleAdmin.id,
				},
				workspace: {
					id,
				},
			});
			await this.userRepos.save({ ...admin, status: USER_STATUS.ENABLE });
		}

		return this.workspaceRepos.save({
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
