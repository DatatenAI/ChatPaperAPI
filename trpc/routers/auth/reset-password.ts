import {publicProcedure} from "@/trpc";
import {ResetPasswordConfirmSchema} from "@/lib/validation";
import prisma from "@/lib/database";
import {hashToken} from "@/lib/auth";
import {TRPCError} from "@trpc/server";

const resetPassword = publicProcedure
    .input(ResetPasswordConfirmSchema)
    .mutation(async ({input, ctx}) => {
        const {token, password, confirmPassword} = input;
        const verificationToken = await prisma.verificationToken.findUnique({
            where: {
                token: hashToken(token)
            }
        });
        if (!verificationToken) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "验证链接已过期"
            });
        }
        await prisma.user.update({
            where: {
                email: verificationToken.identifier
            },
            data: {
                password: hashToken(input.password)
            }
        });

        return {
            message: "密码已重置"
        };
    });

export default resetPassword;