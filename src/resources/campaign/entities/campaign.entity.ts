import { CAMPAIGN_STATUS } from '@common/enums/campaign-status';
import { Cv } from '@resources/cv/entities/cv.entity';
import { User } from '@resources/user/entities/user.entity';
import { Workspace } from '@resources/workspace/entities/workspace.entity';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
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

	@Column({ default: CAMPAIGN_STATUS.ACTIVE, enum: CAMPAIGN_STATUS })
	status: CAMPAIGN_STATUS;

	@ManyToOne(() => Workspace, (workspace) => workspace.campaign)
	workspace: Workspace;

	@ManyToOne(() => User, (user) => user.campaign)
	user: User;

	@OneToMany(() => Cv, (cv) => cv.campaign)
	cv: Cv[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
