import {protectedProcedure} from "@/trpc";
import {UpdatePasswordSchema} from "@/lib/validation";
import prisma from "@/lib/database";
import {hashToken} from "@/lib/auth";
import {TRPCError} from "@trpc/server";
import {Prisma} from "@prisma/client";

const updatePassword = protectedProcedure
    .input(UpdatePasswordSchema)
    .mutation(async ({input, ctx}) => {
        const userId = ctx.session.user.id;
        try {
            await prisma.user.update({
                where: {
                    id: userId,
                    password: hashToken(input.current)
                },
                data: {
                    password: hashToken(input.newPassword)
                }
            });
            return {
                message: "Your password has been updated"
            };
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2025") {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "Current password isn't valid"
                    });
                }
            }
            throw e;
        }
    });

export default updatePassword;