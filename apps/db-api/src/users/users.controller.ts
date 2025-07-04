import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common'
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

  @Post()
  async createUser(@Body() userData: { email: string; name: string }) {
    return this.usersService.createUser(userData)
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id)
  }
}
