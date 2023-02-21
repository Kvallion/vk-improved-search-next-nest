import {
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY,
} from './../utils/consts/envVarNames';
import { JwtPayload, RefreshPayload } from '@common-types/authorization.types';
import { AuthCredentialsDto } from './../user/dto/userCreation.dto';
import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@server/user/user.service';
import { UserEntity } from '@server/user/entities/user.entity';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { TokenPair } from '@common-types/response.types';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  async signUp({ username, password }: AuthCredentialsDto): Promise<TokenPair> {
    const user = await this.userService.createUser({
      username,
      password,
    });

    return this.emitTokensFor(user);
  }

  async signIn({ username, password }: AuthCredentialsDto) {
    const user = await this.userService.userRepository.findOneBy({ username });
    if (!user)
      throw new NotFoundException(`User with name: ${username} is not found`);

    if (!user.idPasswordValid(password))
      throw new UnauthorizedException(`Invalid credentials`);

    return this.emitTokensFor(user);
  }

  async logOut(userId: number) {
    await this.userService.updateRefreshToken(userId, null);
  }

  async refreshToken(refreshToken: string) {
    try {
      const { userId }: RefreshPayload = this.jwtService.verify(refreshToken, {
        secret: this.config.get(JWT_REFRESH_SECRET_KEY),
      });
      const user = await this.userService.getUserById(userId);

      if (!(await bcrypt.compare(refreshToken, user.refreshTokenHash))) {
        throw new UnauthorizedException(`Invalid refresh token`);
      }
      return await this.emitTokensFor(user);
    } catch (error) {
      throw new UnauthorizedException(`Invalid refresh token`);
    }
  }

  private async getTokens(payload: JwtPayload): Promise<TokenPair> {
    const secret = this.config.get(JWT_SECRET_KEY);
    const expiresIn = this.config.get(JWT_EXPIRES_IN);
    const refreshSecret = this.config.get(JWT_REFRESH_SECRET_KEY);
    const refreshExpireIn = this.config.get(JWT_REFRESH_EXPIRES_IN);

    const refreshPayload: RefreshPayload = { id: uuid(), userId: payload.id };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn, secret }),
      this.jwtService.signAsync(refreshPayload, {
        expiresIn: refreshExpireIn,
        secret: refreshSecret,
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private async emitTokensFor(user: UserEntity): Promise<TokenPair> {
    const tokens = await this.getTokens({
      id: user.id,
      username: user.username,
      role: user.role,
    });
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }
}
