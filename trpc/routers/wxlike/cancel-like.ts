import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {addLikeSchema} from "@/lib/wx-validation";
import {date} from "zod";


/// 取消点赞
const cancleLike = publicProcedure
    .input(addLikeSchema)
    .query(async ({input, ctx}) => {
        const {userId,openId,paperId} = input;
        await prisma.wxLike.delete({
            where: {
                weChatUserId: userId,
                openId: openId,
                paperId: paperId,
            }
        })
        return {
            message: "like cancel successfully",
        };
    });

export default cancleLike;
