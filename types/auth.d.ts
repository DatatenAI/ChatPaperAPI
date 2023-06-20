import {User} from "next-auth";
import {Prisma} from "@prisma/client";

type UserId = string

declare module "next-auth/jwt" {
    interface JWT {
        id: UserId
    }
}

declare module "next-auth" {
    interface Session {
        user: User & {
            id: UserId
        }
    }
}