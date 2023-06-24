import {User} from "next-auth";


declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        language: string
    }
}

declare module "next-auth" {
    interface Session {
        user: User & {
            id: string;
            language: string
        }
    }
}