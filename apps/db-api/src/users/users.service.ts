import { User } from '@deskbird/interfaces'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'
import { IdentityProviderService } from '../auth/identity-provider.service'

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly identityProviderService: IdentityProviderService
  ) {}

  async getUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany()
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at.toISOString(),
      updatedAt: user.updated_at.toISOString(),
    }))
  }

  async createUser(userData: { email: string; name: string }): Promise<User> {
    const { subId } = this.identityProviderService.createUser(
      userData.email,
      'regular'
    )

    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        sub_id: subId,
        updated_at: new Date(),
      },
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at.toISOString(),
      updatedAt: user.updated_at.toISOString(),
    }
  }

  async updateUser(id: string, userData: { name: string }): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        name: userData.name,
        updated_at: new Date(),
      },
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at.toISOString(),
      updatedAt: user.updated_at.toISOString(),
    }
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const { email } = await this.prisma.user.delete({
      where: { id },
    })

    this.identityProviderService.deleteUser(email)

    return { message: 'User deleted susccessfully' }
  }
}
