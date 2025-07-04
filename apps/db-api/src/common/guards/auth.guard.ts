import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common'
import { AuthenticationService } from '../../auth/authentication.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthenticationService) {}

  canActivate(context: ExecutionContext): boolean {
    this.authenticationService.validateTokenAndGetPayload(context)
    return true
  }
}
