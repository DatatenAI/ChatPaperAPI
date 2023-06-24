import {protectedProcedure} from "@/trpc";
import {UpdateInfoSchema} from "@/lib/validation";
import prisma from "@/lib/database";

const updateInfo = protectedProcedure
    .input(UpdateInfoSchema)
    .mutation(async ({input, ctx}) => {
        const userId = ctx.session.user.id;
        if (ctx.session.user.email !== input.email) {
            await prisma
        }
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                name: input.name,
            },
        });
    });

export default updateInfo;
