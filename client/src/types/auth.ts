import { User } from "./user"

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  initialized: boolean
}
