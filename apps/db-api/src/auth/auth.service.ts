import { Injectable } from '@nestjs/common'

export interface SignInDto {
  email: string
  password: string
}

export interface SignInResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    name: string
  }
  token?: string
}

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
