import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {subscribeSchema} from "@/lib/wx-validation";


const insertSubscribe = publicProcedure
    .input(subscribeSchema)
    .query(async ({input, ctx}) => {
        const {keywordId,userId} = input;
        await prisma.subscribeKeywords.create({
            data: {
                keywordId: keywordId,
                weChatUserId: userId
            },
        });
        return {
            message: "Subscription added successfully",
        };
    });

export default insertSubscribe;
