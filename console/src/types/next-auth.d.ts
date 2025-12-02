import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
            balance: number
            id_token?: string
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        role: string
        balance: number
        image?: string
        name?: string
        email?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id_token?: string
        role?: string
        balance?: number
        id?: string
    }
}
