import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../user/user.entity";
import { Creator } from "../creator/creator.entity";

@Entity()
export class Supporter {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @OneToMany(() => User, (user) => user.id)
  user: User;

  @OneToMany(() => Creator, (creator) => creator.id)
  favorite_creator: Creator;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}
