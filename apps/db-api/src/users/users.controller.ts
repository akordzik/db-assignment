import { Controller, Get, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { AuthGuard } from '../common/guards/auth.guard'

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    return this.usersService.getUsers()
  }
}
