import prisma from "@/lib/database";
import {subscribeSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";


const cancelSubscribe = appProtectedProcedure
    .input(subscribeSchema)
    .query(async ({input, ctx}) => {
        const {keywordId,openId} = input;
        await prisma.subscribeKeywords.deleteMany({
            where: {
                keywordId: keywordId,
                openId: openId
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
