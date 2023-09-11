import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { User } from '@resources/user/entities/user.entity';
import { ROLE } from '@common/enums';

@Entity()
export class Role extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@IsNotEmpty()
	@IsEnum(ROLE)
	@Column({ unique: true, enum: ROLE })
	name: ROLE;

	@OneToMany(() => User, (user) => user.role)
	user: User[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
