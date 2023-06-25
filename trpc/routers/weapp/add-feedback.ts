import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {addFeedBackSchema} from "@/lib/wx-validation";


const addFeedback = publicProcedure
    .input(addFeedBackSchema)
    .mutation(async ({input, ctx}) => {
        const {userId,openId,type,content} = input
        await prisma.wxFeedback.create({
            data: {
                weChatUserId: userId,
                openId: openId,
                type: type,
                content: content,
                createTime: new Date()
            }
        });
        return {
            message: "feedback added successfully",
        };
    });

export default addFeedback;
