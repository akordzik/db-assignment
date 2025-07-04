import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { PrismaService } from '../common/prisma.service'
import { AuthModule } from '../auth/auth.module'
import { AuthGuard } from '../common/guards/auth.guard'
import { IdentityProviderService } from '../auth/identity-provider.service'

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, AuthGuard, IdentityProviderService],
})
export class UsersModule {}
