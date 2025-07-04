import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { SignInDto, SignInResponse } from '@deskbird/interfaces'
import { IdentityProviderService } from './identity-provider.service'
import { PrismaService } from '../common/prisma.service'
import { Request } from 'express'

@Injectable()
export class AuthService {
  constructor(
    private readonly identityProvider: IdentityProviderService,
    private readonly prisma: PrismaService
  ) {}

  async signIn(signInDto: SignInDto): Promise<SignInResponse> {
    const { email, password } = signInDto

    const maybeToken = await this.identityProvider.validateUser(email, password)
    if (!maybeToken) {
      throw new BadRequestException('Authentication failed')
    }

    const parsedToken = this.identityProvider.verifyToken(maybeToken)
    if (!parsedToken) {
      throw new UnauthorizedException('Invalid token')
    }

    const user = await this.prisma.user.findFirstOrThrow({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: parsedToken.role,
      },
      token: maybeToken,
    }
  }

  async getCurrentUser(request: Request) {
    const payload = this.identityProvider.verifyToken(request.cookies?.token)

    if (!payload) {
      throw new UnauthorizedException('Invalid token')
    }

    return {
      id: payload.sub,
      email: payload.email,
    }
  }
}
