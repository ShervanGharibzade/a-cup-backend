import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Creator } from "../creator/creator.entity";

@Entity()
export class Reward {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @OneToMany(() => Creator, (creator) => creator.id)
  creator: Creator;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}
