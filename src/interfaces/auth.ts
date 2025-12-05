export interface ILogin {
    email: string
    password: string
}

export interface ISignup {
    name: string
    email: string
    password: string
}

export interface IUserData {
    id: number
    name: string
    email: string
    accessToken: string
    address: string | null
    phone: string | null
    image: string | null
    roles: unknown[]
    createdAt: string
    updatedAt: string
    deletedAt: string | null
}

export interface IUser {
    message: string
    data: IUserData
}

export interface UserContextType {
    user: IUser | null
    setUser: (user: IUser | null) => void
    isAuthenticated: boolean
}