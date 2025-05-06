import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Creator } from '../creator/creator.entity';

@Entity()
export class Supporter {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@ManyToOne(() => User, (user) => user.supporters)
	user: User;

	@ManyToOne(() => Creator, (creator) => creator.supporters)
	favorite_creator: Creator;

	@CreateDateColumn({ type: 'timestamptz' })
	created_at: Date;
}
