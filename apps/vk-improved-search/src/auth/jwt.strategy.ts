import { JwtPayload } from '@common-types/authorization.types';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '@server/user/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET_KEY } from '../utils/consts/envVarNames';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private logger = new Logger('AccessTokenStrategy');
  private configService: ConfigService;

  constructor(configService: ConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(JWT_SECRET_KEY),
    });
    this.configService = configService;
  }

  async validate({ id, username, role }: JwtPayload) {
    try {
      const user = await this.userService.getUserById(id);
      if (username !== user.username || role !== user.role) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
