import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { USERS_MAP } from './users-data'

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDatabase()
  }

  private async seedDatabase() {
    console.log('Seeding database with initial users...')
    try {
      for (const [email, userData] of USERS_MAP) {
        const existingUser = await this.prisma.user.findFirst({
          where: { email },
        })

        if (existingUser) {
          console.log(`User ${email} already exists, skipping`)
          continue
        }

        const user = await this.prisma.user.create({
          data: {
            id: userData.id,
            sub_id: userData.subId,
            name: userData.name,
            email: userData.email,
            updated_at: new Date(),
          },
        })

        console.log(`✅ Seeded user: ${user.email}`)
      }

      console.log('✅ Database seeding completed')
    } catch (error) {
      console.error('❌ Error seeding database:', error)
    }
  }
}
