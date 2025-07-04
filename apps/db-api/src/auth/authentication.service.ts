import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { IdentityProviderService } from './identity-provider.service'

@Injectable()
export class AuthenticationService {
  constructor(private readonly identityProvider: IdentityProviderService) {}

  validateTokenAndGetPayload(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    const token = request.cookies?.token

    if (!token) {
      throw new UnauthorizedException('Authentication required')
    }

    const payload = this.identityProvider.verifyToken(token)
    if (!payload) {
      throw new UnauthorizedException('Invalid token')
    }

    return payload
  }
}
