import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";

const list = publicProcedure
    .query(async ({input, ctx}) => {
        const tasks = await prisma.task.findMany({
            include: {
                summary: true
            }
        });
        return tasks;
    });

export default list;