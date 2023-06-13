import "server-only";
import {getServerSession, NextAuthOptions} from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";
import PrismaAdapter from "./PrismaAdapter";
import prisma from "@/lib/database";
import {createHash} from "crypto";


const githubProvider = GithubProvider({
    clientId: process.env.NEXTAUTH_GITHUB_CLIENT_ID,
    clientSecret: process.env.NEXTAUTH_GITHUB_CLIENT_SECRET,
    allowDangerousEmailAccountLinking: true
});
const googleProvider = GoogleProvider({
    clientId: process.env.NEXTAUTH_GITHUB_CLIENT_ID,
    clientSecret: process.env.NEXTAUTH_GITHUB_CLIENT_SECRET,
    allowDangerousEmailAccountLinking: true
});

export const credentialProvider = CredentialProvider({
    credentials: {
        email: {label: "email", type: "text"},
        password: {label: "password", type: "password"}
    },
    authorize: async (credentials, req) => {
        if (!credentials) {
            return null;
        }
        const hashedPassword = hashToken(credentials.password);
        const user = await prisma.user.findUnique({
            select: {
                id: true,
                email: true,
                emailVerified: true
            },
            where: {
                email: credentials.email,
                password: hashedPassword,
                NOT: {
                    emailVerified: null
                }
            }
        });
        if (!user) {
            throw new Error("邮箱或密码错误");
        }
        return user;
    }
});

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        githubProvider,
        googleProvider,
        // emailProvider,
        credentialProvider
    ],
    pages: {
        signIn: "/sign-in",
        error: "/error"
    },
    session: {
        strategy: "jwt"
    },
    events: {},
    callbacks: {
        async session({token, session}) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
            }
            return session;
        },
        async jwt({token, user}) {
            const dbUser = token.email ? await prisma.user.findFirst({
                where: {
                    email: token.email
                }
            }) : null;

            if (!dbUser) {
                if (user) {
                    token.id = user?.id;
                }
                return token;
            }

            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image
            };
        }
    }
};

export const hashToken = (token: string, secret?: string) => {
    return (
        createHash("sha256")
            .update(`${token}${secret || process.env.NEXTAUTH_SECRET}`)
            .digest("hex")
    );
};

export const getSession = async () => {
    return getServerSession(authOptions);
};
export const getCurrentUser = async () => {
    const serverSession = await getSession();
    return serverSession!.user;
};
export const getCurrentUserId: () => Promise<string> = async () => {
    const user = await getCurrentUser();
    return user.id;
};