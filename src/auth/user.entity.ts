import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Doc } from "../docs/doc.entity";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(type => Doc, doc => doc.user, { eager: true })
  docs: Doc[];

  async validatePassword(password: string): Promise<boolean> {
    const decriptedPassword = await bcrypt.hash(password, this.salt);
    
    return decriptedPassword === this.password;
  }
}