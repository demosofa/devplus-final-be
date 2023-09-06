import {
	Injectable,
	BadRequestException,
	NotFoundException,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

import { CreateUserDto, UpdateUserDto } from './dto';
import { IUserService } from './user.interface';
import { User } from './entities/user.entity';
import { RoleService } from '@resources/role/role.service';
import { PageOptionsDto } from '@common/pagination/PageOptionDto';
import { PageMetaDto } from '@common/pagination/PageMetaDto';
import { PageDto } from '@common/pagination/Page.dto';
import { ROLE } from '@common/enums';

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

	async findAll(user: User, pageOptionsDto: PageOptionsDto) {
		const queryBuilder = this.userRepos
			.createQueryBuilder('user')
			.orderBy('user.id', pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		if (user.role.name == ROLE.SUPER_ADMIN) {
			queryBuilder.andWhere('user.roleId != :superAdminRoleId', {
				superAdminRoleId: user.role.id,
			});
		}

		if (user.role.name == ROLE.ADMIN) {
			queryBuilder
				.andWhere('user.roleId != :adminRoleId', {
					adminRoleId: user.role.id,
				})
				.andWhere('user.workspaceId = :workspaceId', {
					workspaceId: user.workspace.id,
				});
		}

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
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

	async findOne(email: string) {
		const user = await this.userRepos.findOne({
			where: { email },
			relations: {
				role: true,
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
}
