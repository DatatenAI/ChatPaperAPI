import {protectedProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {ListPaperSchema} from "@/lib/validation";
import {Prisma} from "@prisma/client";

const list = protectedProcedure
    .input(ListPaperSchema)
    .query(async ({input, ctx}) => {
        const where: Prisma.PaperInfoWhereInput = {
        };
        const total = await prisma.paperInfo.count({
            where,
        })
        let papers = [];
        if (total) {
            papers.push(...await prisma.paperInfo.findMany({
                where,
                skip: (input.current - 1) * input.size,
                take: input.size,
            }))
        }
        return {
            papers,
            total,
        };
    });

export default list;
