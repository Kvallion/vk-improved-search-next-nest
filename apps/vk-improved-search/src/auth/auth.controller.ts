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
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @Post('/signin')
  signIn(@Body() authCredentials) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  signUp(@Body() authCredentials: AuthCredentialsDto) {
    return this.authService.signUp(authCredentials);
  }
}
