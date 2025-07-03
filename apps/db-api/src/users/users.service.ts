import { User } from '@deskbird/interfaces'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersService {
  async getUsers(): Promise<User[]> {
    return []
  }
}
