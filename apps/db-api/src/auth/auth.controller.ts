import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  UseGuards,
  Head,
  Get,
  Req,
} from '@nestjs/common'
import { Response, Request } from 'express'
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
const SESSION_LENGTH_MINUTES = Number(process.env.SESSION_LENGTH_MINUTES) || 30

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(200)
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const signInResponse = await this.authService.signIn(signInDto)

    response.cookie('token', signInResponse.token, {
      ...cookieOptions,
      maxAge: ONE_MINUTE * SESSION_LENGTH_MINUTES,
    })

    return signInResponse
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

  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@Req() request: Request) {
    return this.authService.getCurrentUser(request)
  }
}
