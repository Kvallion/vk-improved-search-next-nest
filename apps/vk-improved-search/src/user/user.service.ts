import { UserRole } from '@common-types/models';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/userCreation.dto';
import { RatingListEntity } from './entities/ratingList.entity';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async createUser({
    username,
    password,
  }: AuthCredentialsDto): Promise<UserEntity> {
    const passwordHash = await UserEntity.hashPassword(password);
    const user = UserEntity.create({
      username,
      password: passwordHash,
      role: UserRole.USER,
      accessToken: null,
    });

    const ratingList = RatingListEntity.create({ user });
    user.ratingList = ratingList;

    try {
      await user.save();
      await ratingList.save();
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      }
      throw new InternalServerErrorException();
    }
  }
}
