
import prisma from "@/lib/database";
import {updateLikeSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";



/// 点赞
const updateLike = appProtectedProcedure
    .input(updateLikeSchema)
    .mutation(async ({input, ctx}) => {
        const {openId, paperId, like} = input;
        await prisma.wxLike.update({
            where: {
                openId_paperId: {
                    openId: openId,
                    paperId: paperId
                }
            },
            data: {
                ifLike: like
            }
        })
        return {
            message: "like updated successfully",
        };
    });

export default updateLike;
