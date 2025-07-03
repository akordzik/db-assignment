import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common'
import { Response, Request } from 'express'
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
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost',
    })

    return user
  }

  @Post('signout')
  @HttpCode(200)
  async signOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost',
    })

    return { message: 'Signed out successfully' }
  }

  @Get('check')
  @HttpCode(200)
  async checkAuth(@Req() request: Request) {
    const token = request.cookies?.token

    if (!token || token !== 'mock-jwt-token-12345') {
      throw new UnauthorizedException('Not authenticated')
    }

    return { authenticated: true }
  }
}
