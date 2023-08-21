import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ROLE } from '@common/enums';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
	constructor(@InjectRepository(Role) private roleRepos: Repository<Role>) {}

	async create(createRoleDto: CreateRoleDto) {
		const isExist = await this.roleRepos.findOneBy({
			name: createRoleDto.name,
		});
		if (isExist) throw new BadRequestException('This role is already existent');
		const result = this.roleRepos.create(createRoleDto);
		return this.roleRepos.save(result);
	}

	async findAll() {
		return this.roleRepos.find();
	}

	async findOne(name: ROLE) {
		const result = await this.roleRepos.findOneBy({ name });
		if (!result) return null;
		return result;
	}

	async findById(id: number) {
		const result = await this.roleRepos.findOneBy({ id });
		if (!result) return null;
		return result;
	}

	async update(id: number, updateRoleDto: UpdateRoleDto) {
		const isExist = await this.roleRepos.findOneBy({
			name: updateRoleDto.name,
		});
		if (isExist) throw new BadRequestException('This role is already existent');
		const target = await this.roleRepos.findOneBy({ id });
		return this.roleRepos.save({ ...target, ...updateRoleDto });
	}

	async remove(id: string) {
		const { affected } = await this.roleRepos.delete(id);
		if (!affected) throw new NotFoundException('Role was founded');
	}
}
