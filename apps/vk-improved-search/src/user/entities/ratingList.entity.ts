import { RatingList } from '@common-types/models';
import { UserEntity } from '@server/user/entities/user.entity';
import { BaseEntity, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ratingLists')
export class RatingListEntity extends BaseEntity implements RatingList {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => UserEntity, (user) => user.ratingList)
  user: UserEntity;
}
