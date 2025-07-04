import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { USERS_MAP } from './users-data'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Client } from 'pg'

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.initializeDatabase()
    await this.seedDatabase()
  }

  private async initializeDatabase() {
    console.log('Initializing database schema...')
    try {
      const sqlFilePath = join(process.cwd(), 'apps/db-api/init-db.sql')
      const sqlContent = readFileSync(sqlFilePath, 'utf-8')

      const client = new Client({
        connectionString: process.env.DATABASE_URL,
      })

      await client.connect()
      await client.query(sqlContent)
      await client.end()

      console.log('✅ Database schema initialized')
    } catch (error) {
      console.error('❌ Error initializing database schema:', error)
      throw error
    }
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
      throw error
    }
  }
}
