import {
	Injectable,
	BadRequestException,
	NotFoundException,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { hash } from 'bcrypt';

import { CreateUserDto, UpdateUserDto, SearchUserDto } from './dto';
import { IUserService } from './user.interface';
import { User } from './entities/user.entity';
import { RoleService } from '@resources/role/role.service';
import { ROLE } from '@common/enums';
import { pagination } from '@common/pagination';

@Injectable()
export class UserService implements IUserService {
	constructor(
		@InjectRepository(User) private userRepos: Repository<User>,
		private roleService: RoleService
	) {}

	async create(createUserDto: CreateUserDto) {
		const { roleName, ...data } = createUserDto;
		try {
			const isExist = await this.userRepos.findOneBy({
				email: data.email,
			});

			if (isExist)
				throw new BadRequestException(
					'The user with this email is already existed'
				);

			let role = await this.roleService.findOne(roleName);
			if (!role) {
				role = await this.roleService.create({ name: roleName });
			}

			data.password = await hash(data.password, 10);
			const user = this.userRepos.create({ ...data, role });

			return this.userRepos.save(user);
		} catch (error) {
			throw new InternalServerErrorException(error.message);
		}
	}

	async findAll(user: User, searchUserDto: SearchUserDto) {
		const findUser = this.userRepos
			.createQueryBuilder('user')
			.orderBy('user.id', searchUserDto.order);

		if (searchUserDto.search) {
			findUser.andWhere('(LOWER(user.name) ILIKE  LOWER(:search))', {
				search: `%${searchUserDto.search}%`,
			});
			findUser.andWhere('user.name ILIKE  :userName', {
				userName: `%${searchUserDto.search}%`,
			});
		}

		if (user.role.name == ROLE.SUPER_ADMIN) {
			findUser.andWhere('user.roleId != :superAdminRoleId', {
				superAdminRoleId: user.role.id,
			});
		}

		if (user.role.name == ROLE.ADMIN) {
			findUser
				.andWhere('user.roleId != :adminRoleId', {
					adminRoleId: user.role.id,
				})
				.andWhere('user.workspaceId = :workspaceId', {
					workspaceId: user.workspace.id,
				});
		}

		return pagination(findUser, searchUserDto);
	}

	async findById(id: number) {
		const user = await this.userRepos.findOne({
			where: { id },
			relations: {
				role: true,
			},
		});
		if (!user) throw new NotFoundException('Can not find the user');
		return user;
	}

	async findOne(where: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
		const user = await this.userRepos.findOne({
			where,
			relations: {
				role: true,
				workspace: true,
			},
		});
		if (!user) throw new NotFoundException('Can not find the user');
		return user;
	}

	async update(id: number, updateUserDto: UpdateUserDto) {
		const { roleName, ...data } = updateUserDto;

		const user = await this.findById(id);
		if (updateUserDto.email && user.email != updateUserDto.email) {
			const isExist = await this.userRepos.findOneBy({
				email: updateUserDto.email,
			});

			if (isExist)
				throw new BadRequestException(
					'The user with this email is already existed'
				);
		}

		try {
			let role = user.role;
			if (roleName) {
				role = await this.roleService.findOne(roleName);
				if (!role) {
					role = await this.roleService.create({ name: roleName });
				}
			}

			return this.userRepos.save({ ...user, ...data, role });
		} catch (error) {
			throw new InternalServerErrorException(error.message);
		}
	}

	async remove(id: number) {
		const { affected } = await this.userRepos.delete(id);
		if (!affected) throw new NotFoundException('Can not find the user');
	}

	async totalUser(user: User) {
		if (user.role.name === ROLE.ADMIN) {
			const pastYear = new Date();
			pastYear.setFullYear(pastYear.getFullYear() - 1);
			const oldYearCount = await this.userRepos
				.createQueryBuilder('user')
				.leftJoinAndSelect('user.workspace', 'workspace')
				.where('EXTRACT(YEAR FROM user.created_at) = :pastYear', {
					pastYear: pastYear.getFullYear(),
				})
				.andWhere('user.roleId != :adminRoleId', {
					adminRoleId: user.role.id,
				})
				.andWhere('user.workspaceId = :workspaceId', {
					workspaceId: user.workspace.id,
				})
				.getCount();

			const currentYearCount = await this.userRepos
				.createQueryBuilder('user')
				.leftJoinAndSelect('user.workspace', 'workspace')
				.where('EXTRACT(YEAR FROM user.created_at) = :currentYear', {
					currentYear: new Date().getFullYear(),
				})
				.andWhere('workspace.id = :workspaceId', {
					workspaceId: user.workspace.id,
				})
				.getCount();

			const totalUserCount = await this.userRepos
				.createQueryBuilder('user')
				.leftJoinAndSelect('user.workspace', 'workspace')
				.where('workspace.id = :workspaceId', {
					workspaceId: user.workspace.id,
				})
				.getCount();

			return { oldYearCount, currentYearCount, totalUserCount };
		} else {
			const pastYear = new Date();
			pastYear.setFullYear(pastYear.getFullYear() - 1);
			const oldYearCount = await this.userRepos
				.createQueryBuilder('user')
				.where('EXTRACT(YEAR FROM user.created_at) = :pastYear', {
					pastYear: pastYear.getFullYear(),
				})
				.getCount();

			const currentYearCount = await this.userRepos
				.createQueryBuilder('user')
				.where('EXTRACT(YEAR FROM user.created_at) = :currentYear', {
					currentYear: new Date().getFullYear(),
				})
				.getCount();

			const totalUserCount = await this.userRepos
				.createQueryBuilder('user')
				.getCount();

			return { oldYearCount, currentYearCount, totalUserCount };
		}
	}
}
