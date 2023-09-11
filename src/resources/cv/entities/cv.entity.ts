import { CV_STATUS } from '@common/enums/cv-status';
import { Campaign } from '@resources/campaign/entities/campaign.entity';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
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

	@Column({ default: CV_STATUS.NEW })
	status: string;

	@ManyToOne(() => Campaign, (campaign) => campaign.cv)
	campaign: Campaign;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
