import { Injectable, Logger } from '@nestjs/common'
import { sign, verify, SignOptions } from 'jsonwebtoken'
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

const users = new Map(
  Array.from(USERS_MAP.entries()).map(([email, user]) => [
    email,
    {
      subId: user.subId,
      email: user.email,
      role: user.role,
    } satisfies IdpUser,
  ])
)

@Injectable()
export class IdentityProviderService {
  private readonly logger = new Logger(IdentityProviderService.name)
  private readonly jwtSecret = 'mock-jwt-secret-key'
  private readonly jwtExpiresIn = `${+(
    process.env.SESSION_LENGTH_MINUTES || 30
  )}m` as const

  async validateUser(email: string, password: string): Promise<string | null> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = users.get(email)
    if (!user) {
      this.logger.warn(`User not found: ${email}`)
      return null
    }

    if (password !== 'admin123') {
      this.logger.warn(`Invalid password for user: ${email}`)
      return null
    }

    return this.generateToken(user)
  }

  createUser(email: string, role: User['role']): Pick<IdpUser, 'subId'> {
    if (users.has(email)) {
      throw new Error('User already exists')
    }

    const user = {
      subId: crypto.randomUUID(),
      email,
      role,
    } satisfies IdpUser

    users.set(email, user)

    this.logger.log(`Created new user: ${email} with role: ${role}`)
    this.logger.log(
      `Current users: ${JSON.stringify(Array.from(users.values()))}`
    )

    return {
      subId: user.subId,
    }
  }

  deleteUser(email: string): void {
    if (!users.has(email)) {
      this.logger.warn(`User not found: ${email}`)
    }

    users.delete(email)

    this.logger.log(`Deleted user: ${email}`)
    this.logger.log(
      `Current users: ${JSON.stringify(Array.from(users.values()))}`
    )
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      return verify(token, this.jwtSecret) as TokenPayload
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

    const options: SignOptions = {
      expiresIn: this.jwtExpiresIn,
    }

    return sign(payload, this.jwtSecret, options)
  }
}
