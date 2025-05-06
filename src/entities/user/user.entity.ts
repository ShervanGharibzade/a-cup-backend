import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Supporter } from '../supporter/supporter.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ unique: true })
	username: string;

	@Column({ unique: true })
	email: string;

	@Column()
	password_hash: string;

	@CreateDateColumn({ type: 'timestamptz' })
	created_at: Date;

	@OneToMany(() => Supporter, (supporter) => supporter.user)
	supporters: Supporter[];
}
