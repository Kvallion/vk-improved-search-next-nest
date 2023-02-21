import { UserRole } from '@common-types/models';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/userCreation.dto';
import { RatingListEntity } from './entities/ratingList.entity';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');

  constructor(
    @InjectRepository(UserEntity)
    public readonly userRepository: Repository<UserEntity>
  ) {}

  async getUserById(id: number) {
    const user = this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} is not found`);
    }
    return user;
  }

  async createUser({
    username,
    password,
  }: AuthCredentialsDto): Promise<UserEntity> {
    const passwordHash = await UserEntity.hashPassword(password);
    const user = UserEntity.create({
      username,
      password: passwordHash,
      role: UserRole.USER,
      refreshTokenHash: null,
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

  async updateRefreshToken(userId: number, refreshToken: string | null) {
    const user = await this.getUserById(userId);
    if (!refreshToken) {
      user.refreshTokenHash = null;
    } else {
      user.refreshTokenHash = await bcrypt.hash(refreshToken, 6);
    }
    await user.save();
  }
}
