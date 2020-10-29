import { User } from "../auth/user.entity";
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { DocPersonal } from "./doc-personal.enum";

@Entity()
export class Doc extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  personal: DocPersonal;

  @ManyToOne(type => User, user => user.docs, { eager: false })
  user: User;

  @Column()
  userId: number;
}