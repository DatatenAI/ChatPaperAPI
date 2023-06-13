import {Adapter, AdapterAccount, AdapterUser, VerificationToken} from "next-auth/adapters";
import {Prisma, PrismaClient, VerificationTokenType} from "@prisma/client";

const PrismaAdapter = (prisma: PrismaClient) => {
    const adapter: Adapter = {
        createSession(session) {
            return session;
        },
        deleteSession(sessionToken: string) {
            return null;
        },
        getSessionAndUser(sessionToken: string) {
            return null;
        },
        updateSession(session) {
            return null;
        },

        createUser(data: Omit<AdapterUser, "id">) {
            return prisma.user.create({data});
        },

        getUser(id: string) {
            return prisma.user.findUnique({
                select: {
                    id: true,
                    email: true,
                    emailVerified: true
                },
                where: {id}
            });
        },

        async getUserByAccount(provider_providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">) {
            const account = await prisma.account.findUnique({
                where: {
                    provider_providerAccountId
                },
                select: {user: true}
            });
            return account?.user ?? null;
        },

        getUserByEmail(email: string) {
            return prisma.user.findUnique({
                select: {
                    id: true,
                    email: true,
                    emailVerified: true
                },
                where: {email}
            });
        },

        async linkAccount({
                              access_token,
                              token_type,
                              refresh_token,
                              expires_at,
                              session_state,
                              id_token,
                              ...data
                          }: AdapterAccount) {
            const {
                accessToken,
                tokenType,
                refreshToken,
                expiresAt,
                idToken,
                sessionState,
                scope,
                ...account
            } = await prisma.account.create({
                data: {
                    ...data,
                    accessToken: access_token,
                    tokenType: token_type,
                    refreshToken: refresh_token,
                    expiresAt: expires_at,
                    idToken: id_token
                }
            });
            return {
                ...account,
                access_token: accessToken || undefined,
                token_type: tokenType || undefined,
                refresh_token: refreshToken || undefined,
                expires_at: expiresAt || undefined,
                id_token: idToken || undefined,
                session_state: sessionState || undefined,
                scope: scope || undefined
            } satisfies AdapterAccount;
        },


        updateUser({id, ...data}: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
            return prisma.user.update({
                where: {id},
                data
            });
        },

        async createVerificationToken(data: VerificationToken): Promise<VerificationToken | null | undefined> {
            return await prisma.verificationToken.create({
                data: {
                    ...data,
                    type: VerificationTokenType.register
                }
            });
        },

        deleteUser(id: string): Promise<AdapterUser | null | undefined> {
            return prisma.user.delete({where: {id}});
        },

        async unlinkAccount(provider_providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">): Promise<void> {
            await prisma.account.delete({where: {provider_providerAccountId}});
        },

        async useVerificationToken(params: { identifier: string; token: string }): Promise<VerificationToken | null> {
            try {
                return await prisma.verificationToken.update({
                    where: {token: params.token},
                    data: {
                        usedAt: new Date()
                    }
                });
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    if (error.code === "P2025") {
                        return null;
                    }
                }
                throw error;
            }
        }

    };
    return adapter;
};

export default PrismaAdapter;