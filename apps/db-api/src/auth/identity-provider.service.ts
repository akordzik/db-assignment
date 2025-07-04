import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { USERS_MAP, User } from '../common/users-data'

interface TokenPayload {
  sub: string
  email: string
  name: string
  iat?: number
  exp?: number
}

@Injectable()
export class IdentityProviderService {
  private readonly jwtSecret = 'mock-jwt-secret-key'
  private readonly jwtExpiresIn = '1h'
  private users: Map<string, User>

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

  createUser(
    email: string,
    name: string,
    role: User['role']
  ): Pick<User, 'id'> {
    if (this.users.has(email)) {
      throw new Error('User already exists')
    }

    const user: User = {
      id: crypto.randomUUID(),
      subId: crypto.randomUUID(),
      email,
      name,
      role,
    }

    this.users.set(email, user)

    return {
      id: user.id,
    }
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.jwtSecret) as TokenPayload
    } catch {
      return null
    }
  }

  private generateToken(user: User): string {
    const payload: TokenPayload = {
      sub: user.subId,
      email: user.email,
      name: user.name,
    }

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    })
  }
}
