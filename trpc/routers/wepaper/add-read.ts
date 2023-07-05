import prisma from "@/lib/database";
import {addReadSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";


/// 加入待阅
const addRead = appProtectedProcedure
    .input(addReadSchema)
    .query(async ({input, ctx}) => {
        const {userId,openId,paperId} = input;
        await prisma.wxWaitRead.create({
            data: {
                weChatUserId: userId,
                openId: openId,
                paperId: paperId,
                createTime: new Date()
            }
        })
        return {
            message: "read added successfully",
        };
    });

export default addRead;
