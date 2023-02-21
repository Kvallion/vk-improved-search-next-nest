import { UserRole } from '@common-types/models';

export interface JwtPayload {
  id: number;
  username: string;
  role: UserRole;
}

export interface RefreshPayload {
  id: string;
  userId: number;
}
