import { AuthCredentialsDto } from './../user/dto/userCreation.dto';
import { Injectable } from '@nestjs/common';
import { UserService } from '@server/user/user.service';
import { UserEntity } from '@server/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signUp({
    username,
    password,
  }: AuthCredentialsDto): Promise<Partial<UserEntity>> {
    const user: Partial<UserEntity> = await this.userService.createUser({
      username,
      password,
    });

    delete user.password;
    delete user.accessToken;
    delete user.role;
    delete user.ratingList;

    return user;
  }
}
