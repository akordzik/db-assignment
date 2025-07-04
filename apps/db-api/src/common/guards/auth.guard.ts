import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { IdentityProviderService } from '../../auth/identity-provider.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly identityProvider: IdentityProviderService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()
    const token = request.cookies?.token

    if (!token) {
      throw new UnauthorizedException('Authentication required')
    }

    const payload = this.identityProvider.verifyToken(token)
    if (!payload) {
      throw new UnauthorizedException('Invalid token')
    }

    return true
  }
}
