import { Controller, Post, Body, Res, HttpCode } from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { SignInDto } from '@deskbird/interfaces'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(200)
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const { user, token } = await this.authService.signIn(signInDto)

    response.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    })

    return user
  }
}
