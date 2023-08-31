import {
	Injectable,
	BadRequestException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

import { CreateUserDto, UpdateUserDto } from './dto';
import { IUserService } from './user.interface';
import { User } from './entities/user.entity';
import { RoleService } from '@resources/role/role.service';
import { Role } from '@resources/role/entities/role.entity';

@Injectable()
export class UserService implements IUserService {
	constructor(
		@InjectRepository(User) private userRepos: Repository<User>,
		private roleService: RoleService
	) {}

	async create(createUserDto: CreateUserDto) {
		const { roleName, ...data } = createUserDto;
		const isExist = await this.userRepos.findOneBy({
			email: createUserDto.email,
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
	}

	async findAll() {
		return this.userRepos.find();
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
		if (user.email != updateUserDto.email) {
			const isExist = await this.userRepos.findOneBy({
				email: updateUserDto.email,
			});

			if (isExist)
				throw new BadRequestException(
					'The user with this email is already existed'
				);
		}

		let role: Role = user.role;
		if (roleName) {
			role = await this.roleService.findOne(roleName);
			if (!role) {
				role = await this.roleService.create({ name: roleName });
			}
		}

		return this.userRepos.save({ ...user, ...data, role });
	}

	async remove(id: number) {
		const { affected } = await this.userRepos.delete(id);
		if (!affected) throw new NotFoundException('Can not find the user');
	}
}
