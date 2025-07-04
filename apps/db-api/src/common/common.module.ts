import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { AuthGuard } from './guards/auth.guard'

@Module({
  imports: [AuthModule],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class CommonModule {}
