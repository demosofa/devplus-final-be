import { Campaign } from '@resources/campaign/entities/campaign.entity';
import { User } from '@resources/user/entities/user.entity';
import {
	Column,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

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

<<<<<<< HEAD
	@OneToMany(() => User, (user) => user.workspace)
=======
	@OneToMany(() => User, (user) => user.workspace, {
		eager: true,
		onDelete: 'CASCADE',
	})
>>>>>>> 7f96269 (feat: dp 39)
	user: User[];
}
