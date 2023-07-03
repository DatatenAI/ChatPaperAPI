import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {subscribeSchema} from "@/lib/wx-validation";


const addSubscribe = publicProcedure
    .input(subscribeSchema)
    .query(async ({input, ctx}) => {
        const {keywordId,openId,userId} = input;
        const existingRecord = await prisma.subscribeKeywords.findFirst({
            where: {
                keywordId: keywordId,
                openId: openId,
                weChatUserId: userId
            },
        });

        if (existingRecord) {
            return {
                message: "keywords already be Subscribe!",
            };
        }
        await prisma.subscribeKeywords.create({
            data: {
                keywordId: keywordId,
                openId: openId,
                weChatUserId: userId
            },
        });
        await prisma.keywords.update({
            where: { id:keywordId },
            data: {
                subNum: {
                    increment: 1,
                },
            },
        });
        return {
            message: "Subscription added successfully",
        };
    });

export default addSubscribe;
