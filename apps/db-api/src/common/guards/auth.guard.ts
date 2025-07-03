import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()
    const token = request.cookies?.token

    if (!token || token !== 'mock-jwt-token-12345') {
      throw new UnauthorizedException('Authentication required')
    }

    return true
  }
}
