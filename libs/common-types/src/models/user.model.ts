import { RatingList } from '@common-types/models';

export interface IUser {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  accessToken: string;
  ratingList: RatingList;
}

export interface UserCreationAttributes {
  username: string;
  password: string;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
