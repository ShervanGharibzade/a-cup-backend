import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Supporter } from "../supporter/supporter.entity";
import { Reward } from "../reward/reward.entity";

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @OneToMany(() => Supporter, (supporter) => supporter.id)
  supporter: Supporter;

  @OneToMany(() => Reward, (reward) => reward.id)
  reward: Reward;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}
