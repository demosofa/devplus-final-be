import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

export interface IUserService {
	create(createUserDto: CreateUserDto): Promise<User>;

	findById(id: string): Promise<User>;

	findOne(username: string): Promise<User>;

	update(id: string, updateUserDto: UpdateUserDto): Promise<User>;

	remove(id: string): Promise<void>;
}

export const IUserService = Symbol('IUserService');
