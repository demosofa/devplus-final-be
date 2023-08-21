import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '@resources/user/entities/user.entity';

@Entity()
export class Role extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@IsNotEmpty()
	@IsString()
	@Column({ unique: true })
	name: string;

	@OneToMany(() => User, (user) => user.role)
	user: User[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
