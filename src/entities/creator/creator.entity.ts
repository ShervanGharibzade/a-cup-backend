import {
  Column,
  CreateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../user/user.entity";

export class Creator {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @OneToMany(() => User, (user) => user.id)
  user: User;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  profile_picture_url: string;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}
