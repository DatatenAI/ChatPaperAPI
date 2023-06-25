import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {subscribeSchema} from "@/lib/wx-validation";


const cancelSubscribe = publicProcedure
    .input(subscribeSchema)
    .query(async ({input, ctx}) => {
        const {keywordId,openId,userId} = input;
        await prisma.subscribeKeywords.deleteMany({
            where: {
                keywordId: keywordId,
                openId: openId,
                weChatUserId: userId
            },
        });
        await prisma.keywords.update({
            where: { id:keywordId },
            data: {
                subNum: {
                    increment: -1,
                },
            },
        });
        return {
            message: "Subscription delete successfully",
        };
    });

export default cancelSubscribe;
