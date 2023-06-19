import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {addReadSchema} from "@/lib/wx-validation";
import {date} from "zod";


/// 加入待阅
const addRead = publicProcedure
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
