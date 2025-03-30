import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Supporter } from "../supporter/supporter.entity";
import { Creator } from "../creator/creator.entity";

@Entity()
export class Donation {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @OneToMany(() => Supporter, (supporter) => supporter.id)
  supporter: Supporter;

  @OneToMany(() => Creator, (creator) => creator.id)
  creator: Creator;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  message: string;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}
