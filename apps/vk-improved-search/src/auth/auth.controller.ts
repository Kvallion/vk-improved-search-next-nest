import { AuthService } from './auth.service';
import { Controller, Post, Get, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  signIn(@Body() authCredentials) {}
}
