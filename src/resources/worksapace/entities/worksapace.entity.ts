import { Campaign } from '@resources/campaign/entities/campaign.entity';
import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Worksapace extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title_workspace: string;

	@Column()
	admin_email: string;

	@Column()
	admin_password: string;

	@Column()
	status: string;

	@OneToMany(() => Campaign, (campaign) => campaign.workspace)
	campain: Campaign[];
}
