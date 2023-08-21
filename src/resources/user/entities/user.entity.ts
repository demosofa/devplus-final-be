import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	BeforeInsert,
	BeforeUpdate,
} from 'typeorm';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Role } from '@resources/role/entities/role.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@IsNotEmpty()
	@Column()
	firstName: string;

	@IsNotEmpty()
	@Column()
	lastName: string;

	@Column()
	fullName: string;

	@Column({ unique: true })
	username: string;

	@IsEmail()
	@Column({ unique: true })
	email: string;

	@Exclude()
	@IsStrongPassword()
	@Column()
	password: string;

	@ManyToOne(() => Role, (role) => role.user)
	role: Role;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@BeforeInsert()
	createFullName() {
		this.fullName = this.firstName + ' ' + this.lastName;
	}

	@BeforeUpdate()
	updateFullName() {
		this.fullName = this.firstName + ' ' + this.lastName;
	}
}
