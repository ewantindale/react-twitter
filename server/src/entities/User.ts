import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Like } from "./Like";
import { Post } from "./Post";

@Entity()
export class User extends BaseEntity {
  toJSON() {
    delete this.password;
    return this;
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  pictureId: string; // cloudinary public_id

  @Column()
  password!: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
}
