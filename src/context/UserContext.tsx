import { useState, useEffect, type ReactNode } from 'react'
import type { IUser } from '../interfaces/auth'
import { UserContext } from './context'

interface UserProviderProps {
    children: ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<IUser | null>(() => {
        // Initialize from localStorage if available
        const savedUser = localStorage.getItem('user')
        return savedUser ? JSON.parse(savedUser) : null
    })

    const isAuthenticated = !!user

    // Persist user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user))
        } else {
            localStorage.removeItem('user')
        }
    }, [user])
    return (
        <UserContext.Provider value={{ user, setUser, isAuthenticated }}>
            {children}
        </UserContext.Provider>
    )
}


