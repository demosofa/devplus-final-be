import { Campaign } from '@resources/campaign/entities/campaign.entity';
import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Cv extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	phone_number: string;

	@Column()
	apply_position: string;

	@Column()
	file: string;

	@Column()
	create_at: Date;

	@Column()
	status: string;

	@ManyToOne(() => Campaign, (campaign) => campaign.cv)
	campaign: Campaign;
}
