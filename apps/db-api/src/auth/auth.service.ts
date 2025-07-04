import { BadRequestException, Injectable } from '@nestjs/common'
import { SignInDto, SignInResponse } from '@deskbird/interfaces'
import { IdentityProviderService } from './identity-provider.service'
import { PrismaService } from '../common/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly identityProvider: IdentityProviderService,
    private readonly prisma: PrismaService
  ) {}

  async signIn(signInDto: SignInDto): Promise<SignInResponse> {
    const { email, password } = signInDto

    const maybeToken = this.identityProvider.validateUser(email, password)
    if (!maybeToken) {
      throw new BadRequestException('Authentication failed')
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
      user,
      token: maybeToken,
    }
  }
}
