import { User } from "src/auth/user.entity";
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { DocPrivate } from "./doc-private.enum";

@Entity()
export class Doc extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  private: DocPrivate;

  @ManyToOne(type => User, user => user.docs, { eager: false })
  user: User;

  @Column()
  userId: number;
}