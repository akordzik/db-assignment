import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { IdentityProviderService } from './identity-provider.service'
import { PrismaService } from '../common/prisma.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, IdentityProviderService, PrismaService],
  exports: [IdentityProviderService],
})
export class AuthModule {}
