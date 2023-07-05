import prisma from "@/lib/database";
import {scarchMyKeywordsSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";


const searchMyKeyWords = appProtectedProcedure
    .input(scarchMyKeywordsSchema)
    .query(async ({input, ctx}) => {
        const {userId,openId} = input;
        const mykeywords = await prisma.subscribeKeywords.findMany({
            where: {
                weChatUserId: userId !== null ? userId : undefined,
                openId: openId
            },
            include: {keywords: true}
        })
        const defKeyWords =  await prisma.keywords.findMany({
            orderBy: {
                subNum: 'desc'
            }
        })
        return {"mykeywords":mykeywords,"defKeyWords":defKeyWords}
    });

export default searchMyKeyWords;
