import { WORKSPACE_STATUS } from '@common/enums/workspace-status';
import { Campaign } from '@resources/campaign/entities/campaign.entity';
import { User } from '@resources/user/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Workspace {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	title_workspace: string;

	@Column({ default: WORKSPACE_STATUS.PENDING })
	status: string;

	@OneToMany(() => Campaign, (campaign) => campaign.workspace, {
		cascade: true,
	})
	campaign: Campaign[];

	@OneToMany(() => User, (user) => user.workspace, {
		eager: true,
		onDelete: 'CASCADE',
	})
	user: User[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
