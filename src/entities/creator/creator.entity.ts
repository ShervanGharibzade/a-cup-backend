import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Supporter } from '../supporter/supporter.entity';

@Entity()
export class Creator {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ nullable: true })
	bio: string;

	@Column({ nullable: true })
	profile_picture_url: string;

	@CreateDateColumn({ type: 'timestamptz' })
	created_at: Date;

	@OneToMany(() => Supporter, (supporter) => supporter.favorite_creator)
	supporters: Supporter[];
}
