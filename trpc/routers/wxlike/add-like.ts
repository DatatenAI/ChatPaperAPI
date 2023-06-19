import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {addLikeSchema} from "@/lib/wx-validation";
import {date} from "zod";


/// 点赞
const addLike = publicProcedure
    .input(addLikeSchema)
    .query(async ({input, ctx}) => {
        const {userId,openId,paperId} = input;
        await prisma.wxLike.create({
            data: {
                weChatUserId: userId,
                openId: openId,
                paperId: paperId,
                createTime: new date()
            }
        })
        return {
            message: "like added successfully",
        };
    });

export default addLike;
