import { BadRequestException, Injectable } from '@nestjs/common'
import { SignInDto, SignInResponse } from '@deskbird/interfaces'

@Injectable()
export class AuthService {
  async signIn(signInDto: SignInDto): Promise<SignInResponse> {
    const { email, password } = signInDto

    if (email === 'admin@example.com' && password === 'password123') {
      return {
        user: {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
        },
        token: 'mock-jwt-token-12345',
      }
    }

    throw new BadRequestException('Invalid email or password')
  }
}
