import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInDto } from '@deskbird/interfaces'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto)
  }
}
