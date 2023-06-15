import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";


const searchKeyWords = publicProcedure
    .query(async ({input, ctx}) => {
        return await prisma.keywords.findMany();
    });

export default searchKeyWords;
