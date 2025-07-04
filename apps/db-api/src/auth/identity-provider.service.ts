import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { USERS_MAP, User } from '../common/users-data'

interface TokenPayload {
  sub: string
  email: string
  role: User['role']
  iat?: number
  exp?: number
}

interface IdpUser {
  subId: string
  email: string
  role: User['role']
}

@Injectable()
export class IdentityProviderService {
  private readonly jwtSecret = 'mock-jwt-secret-key'
  private readonly jwtExpiresIn = '1h'
  private users: Map<string, IdpUser>

  constructor() {
    this.users = new Map(USERS_MAP)
  }

  validateUser(email: string, password: string): string | null {
    const user = this.users.get(email)
    if (!user) {
      return null
    }

    if (password !== 'admin123') {
      return null
    }

    return this.generateToken(user)
  }

  createUser(email: string, role: User['role']): Pick<IdpUser, 'subId'> {
    if (this.users.has(email)) {
      throw new Error('User already exists')
    }

    const user = {
      subId: crypto.randomUUID(),
      email,
      role,
    } satisfies IdpUser

    this.users.set(email, user)

    return {
      subId: user.subId,
    }
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.jwtSecret) as TokenPayload
    } catch {
      return null
    }
  }

  private generateToken(user: IdpUser): string {
    const payload = {
      sub: user.subId,
      email: user.email,
      role: user.role,
    } satisfies TokenPayload

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    })
  }
}
