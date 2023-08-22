import { Campaign } from '@resources/campaign/entities/campaign.entity';
import { User } from '@resources/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Workspace {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title_workspace: string;

	@Column()
	status: string;

	@OneToMany(() => Campaign, (campaign) => campaign.workspace)
	campaign: Campaign[];

	@OneToMany(() => User, (user) => user.workspace)
	user: User[];
}
