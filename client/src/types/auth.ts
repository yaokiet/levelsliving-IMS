export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}