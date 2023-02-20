import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { IUser, UserRole } from '@common-types/models';
import { RatingListEntity } from './ratingList.entity';
import * as bcrypt from 'bcrypt';

@Entity('users')
@Unique(['username'])
export class UserEntity extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 30 })
  username: string;

  @Column('varchar', { length: 100 })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column('varchar', { length: 200, nullable: true })
  accessToken: string;

  @OneToOne((type) => RatingListEntity, (list) => list.user)
  ratingList: RatingListEntity;

  static async hashPassword(password: string) {
    return bcrypt.hash(password, 5);
  }

  static async validatePassword(
    password: string,
    passwordHash: string
  ): Promise<boolean> {
    return (await this.hashPassword(password)) === passwordHash;
  }
  async validatePassword(passwordHash: string): Promise<boolean> {
    return (await UserEntity.hashPassword(this.password)) === passwordHash;
  }
}
