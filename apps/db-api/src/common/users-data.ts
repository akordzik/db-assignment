import { v4 as uuidv4 } from 'uuid'

export interface User {
  id: string
  subId: string
  email: string
  name: string
  role: 'admin' | 'regular'
}

export const USERS_MAP = new Map<string, User>([
  [
    'admin@example.com',
    {
      id: uuidv4(),
      subId: uuidv4(),
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
    },
  ],
])

export const getAllUsers = (): User[] => Array.from(USERS_MAP.values())
