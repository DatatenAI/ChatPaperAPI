
import prisma from "@/lib/database";
import {addLikeSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";


/// 取消点赞
const cancelLike = appProtectedProcedure
    .input(addLikeSchema)
    .query(async ({input, ctx}) => {
        const {userId,openId,paperId} = input;
        await prisma.wxLike.delete({
            where: {
                weChatUserId_openId_paperId: {
                    weChatUserId: userId,
                    openId: openId,
                    paperId: paperId
                }
            },
        })
        return {
            message: "like cancel successfully",
        };
    });

export default cancelLike;
