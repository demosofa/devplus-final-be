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
import { USER_STATUS } from '@common/enums/user-status';

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
	@Column({ default: USER_STATUS.DISABLE })
	status: string;

	@ManyToOne(() => Workspace, (workspace) => workspace.user, {
		onDelete: 'CASCADE',
	})
	workspace: Workspace;

	@ManyToOne(() => Role, (role) => role.user)
	role: Role;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
