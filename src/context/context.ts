import { createContext } from 'react'
import type { UserContextType } from '../interfaces/auth'

export const UserContext = createContext<UserContextType | undefined>(undefined)

