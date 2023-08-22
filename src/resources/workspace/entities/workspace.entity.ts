import { Campaign } from '@resources/campaign/entities/campaign.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Workspace {
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
	campaign: Campaign[];
}
