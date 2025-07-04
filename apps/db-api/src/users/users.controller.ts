import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { AuthGuard } from '../common/guards/auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    return this.usersService.getUsers()
  }

  @Post()
  @Roles('admin')
  async createUser(@Body() userData: { email: string; name: string }) {
    return this.usersService.createUser(userData)
  }

  @Patch(':id')
  @Roles('admin')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: { name: string }
  ) {
    return this.usersService.updateUser(id, userData)
  }

  @Delete(':id')
  @Roles('admin')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id)
  }
}
