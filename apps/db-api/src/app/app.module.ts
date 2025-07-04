import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'
import { CommonModule } from '../common/common.module'
import { PrismaService } from '../common/prisma.service'
import { DatabaseSeedService } from '../common/seed.service'

@Module({
  imports: [AuthModule, UsersModule, CommonModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, DatabaseSeedService],
  exports: [PrismaService],
})
export class AppModule {}
