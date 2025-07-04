import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
  CanActivate,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthenticationService } from '../../auth/authentication.service'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authenticationService: AuthenticationService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) {
      return true
    }

    const payload =
      this.authenticationService.validateTokenAndGetPayload(context)

    if (!requiredRoles.includes(payload.role)) {
      throw new ForbiddenException('Insufficient permissions')
    }

    return true
  }
}
