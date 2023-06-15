import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {subscribeSchema} from "@/lib/wx-validation";


const deleteSubscribe = publicProcedure
    .input(subscribeSchema)
    .query(async ({input, ctx}) => {
        const {keywordId,userId} = input;
        await prisma.subscribeKeywords.delete({
            where: {
                keywordId: keywordId,
                weChatUserId: userId
            },
        });
        return {
            message: "Subscription delete successfully",
        };
    });

export default deleteSubscribe;
