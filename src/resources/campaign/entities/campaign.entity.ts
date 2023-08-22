import { Cv } from '@resources/cv/entities/cv.entity';
import { Worksapace } from '@resources/worksapace/entities/worksapace.entity';
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

	@ManyToOne(() => Worksapace, (workspace) => workspace.campain)
	workspace: Worksapace;

	@OneToMany(() => Cv, (cv) => cv.campain)
	cv: Cv[];
}
