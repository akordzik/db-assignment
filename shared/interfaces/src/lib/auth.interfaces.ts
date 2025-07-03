export interface SignInDto {
  email: string
  password: string
}

export interface SignInResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    name: string
  }
  token?: string
}
