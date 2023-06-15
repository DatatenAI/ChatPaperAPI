import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {scarchMyKeywordsSchema} from "@/lib/wx-validation";


const searchMyKeyWords = publicProcedure
    .input(scarchMyKeywordsSchema)
    .query(async ({input, ctx}) => {
        const {userId} = input;
        return await prisma.subscribeKeywords.findMany({
            where: {
                weChatUserId: userId
            },
            include: {keywords: true}
        })
    });

export default searchMyKeyWords;
