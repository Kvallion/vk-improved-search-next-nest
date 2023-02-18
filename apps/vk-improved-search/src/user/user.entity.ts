import { BaseEntity } from 'typeorm';
import type { IUser } from '@common-types';

export class UserEntity extends BaseEntity implements IUser {
  id: number;
  username: string;
}
