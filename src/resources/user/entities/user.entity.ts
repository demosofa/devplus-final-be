import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
} from 'typeorm';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Role } from '@resources/role/entities/role.entity';
import { Workspace } from '@resources/workspace/entities/workspace.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@IsNotEmpty()
	@Column()
	name: string;

	@IsEmail()
	@Column({ unique: true })
	email: string;

	@Exclude()
	@IsStrongPassword()
	@Column()
	password: string;

	@IsNotEmpty()
	@Column()
	phone_number: string;

	@IsNotEmpty()
	@Column()
	status: string;

	@ManyToOne(() => Workspace)
	workspace: Workspace;

	@ManyToOne(() => Role, (role) => role.user)
	role: Role;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
