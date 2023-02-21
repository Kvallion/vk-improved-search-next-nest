import { TokenPair } from '@common-types/response.types';
import { AuthCredentialsDto } from './../user/dto/userCreation.dto';
import { AuthService } from './auth.service';
import {
  Controller,
  Post,
  Get,
  Body,
  Logger,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/GetUser.decorator';
import { UserEntity } from '@server/user/entities/user.entity';
import { ValidateJwtPipe } from './pipies/ValidateRefreshToken.pipe';

@Controller('auth')
@UsePipes(ValidationPipe)
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() authCredentials: AuthCredentialsDto): Promise<TokenPair> {
    return this.authService.signUp(authCredentials);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() authCredentials: AuthCredentialsDto): Promise<TokenPair> {
    return this.authService.signIn(authCredentials);
  }

  @Post('/logout')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  logOut(@GetUser() user: UserEntity) {
    return this.authService.logOut(user.id);
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body('refreshToken', ValidateJwtPipe) refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
