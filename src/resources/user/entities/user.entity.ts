import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
	BaseEntity,
} from 'typeorm';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Role } from '@resources/role/entities/role.entity';
import { Workspace } from '@resources/workspace/entities/workspace.entity';
import { USER_STATUS } from '@common/enums/user-status';
import { Campaign } from '@resources/campaign/entities/campaign.entity';

@Entity()
export class User extends BaseEntity {
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
	@Column({ default: USER_STATUS.ENABLE, enum: USER_STATUS })
	status: USER_STATUS;

	@ManyToOne(() => Workspace, (workspace) => workspace.user, {
		onDelete: 'CASCADE',
	})
	workspace: Workspace;

	@OneToMany(() => Campaign, (campaign) => campaign.user)
	campaign: Campaign[];

	@ManyToOne(() => Role, (role) => role.user)
	role: Role;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
