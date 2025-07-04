import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { PrismaService } from '../common/prisma.service'
import { CommonModule } from '../common/common.module'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [CommonModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
