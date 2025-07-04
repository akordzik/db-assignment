import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  UseGuards,
  Head,
} from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { SignInDto } from '@deskbird/interfaces'
import { AuthGuard } from '../common/guards/auth.guard'

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost',
} as const

const ONE_MINUTE = 60 * 1000

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
      ...cookieOptions,
      maxAge: ONE_MINUTE,
    })

    return user
  }

  @Post('signout')
  @HttpCode(200)
  async signOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token', cookieOptions)

    return { message: 'Signed out successfully' }
  }

  @Head('check')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async checkAuth() {
    return null
  }
}
