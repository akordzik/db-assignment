export interface SignInDto {
  email: string
  password: string
}

export interface SignInResponse {
  user: {
    id: string
    email: string
    name: string
    role: UserRole
  }
  token: string
}

export type UserRole = 'admin' | 'regular'
