import { Cv } from '@resources/cv/entities/cv.entity';
import { Workspace } from '@resources/workspace/entities/workspace.entity';
import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Campaign extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	description: string;

	@Column()
	expired_time: Date;

	@Column()
	status: string;

	@ManyToOne(() => Workspace, (workspace) => workspace.campaign)
	workspace: Workspace;

	@OneToMany(() => Cv, (cv) => cv.campaign)
	cv: Cv[];
}
