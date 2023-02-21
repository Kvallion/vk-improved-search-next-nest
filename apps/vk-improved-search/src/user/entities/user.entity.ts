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

  @OneToOne((type) => RatingListEntity, (list) => list.user)
  ratingList: RatingListEntity;

  @Column('varchar', { length: 250, nullable: true })
  refreshTokenHash: string;

  static async hashPassword(password: string) {
    return bcrypt.hash(password, 5);
  }

  static async idPasswordValid(
    password: string,
    passwordHash: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  }
  async idPasswordValid(password: string): Promise<boolean> {
    return UserEntity.idPasswordValid(password, this.password);
  }
}
