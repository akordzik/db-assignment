import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { IdentityProviderService } from './identity-provider.service'
import { AuthenticationService } from './authentication.service'
import { PrismaService } from '../common/prisma.service'

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    IdentityProviderService,
    AuthenticationService,
    PrismaService,
  ],
  exports: [IdentityProviderService, AuthenticationService],
})
export class AuthModule {}
