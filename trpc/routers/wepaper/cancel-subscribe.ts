import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {subscribeSchema} from "@/lib/wx-validation";


const cancelSubscribe = publicProcedure
    .input(subscribeSchema)
    .query(async ({input, ctx}) => {
        const {keywordId,userId} = input;
        await prisma.subscribeKeywords.delete({
            where: {
                keywordId: keywordId,
                weChatUserId: userId
            },
        });
        await prisma.keywords.update({
            where: { id:keywordId },
            data: {
                sub_num: {
                    increment: -1,
                },
            },
        });
        return {
            message: "Subscription delete successfully",
        };
    });

export default cancelSubscribe;
