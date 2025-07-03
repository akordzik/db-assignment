import { Injectable } from '@nestjs/common'
import { SignInDto, SignInResponse } from '@deskbird/interfaces'

@Injectable()
export class AuthService {
  signIn(signInDto: SignInDto): SignInResponse {
    const { email, password } = signInDto

    if (email === 'admin@example.com' && password === 'password123') {
      return {
        success: true,
        message: 'Sign in successful',
        user: {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
        },
        token: 'mock-jwt-token-12345',
      }
    }

    return {
      success: false,
      message: 'Invalid email or password',
    }
  }
}
