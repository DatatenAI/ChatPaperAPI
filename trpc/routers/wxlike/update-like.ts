
import prisma from "@/lib/database";
import {updateLikeSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";



/// 点赞
const updateLike = appProtectedProcedure
    .input(updateLikeSchema)
    .mutation(async ({input, ctx}) => {
        const {openId, paperId, like, comment} = input;
        
        if (like) {
            // liking doesn't fill comment
            await prisma.wxLike.update({
                where: {
                    openId_paperId: {
                        openId: openId,
                        paperId: paperId
                    }
                },
                data: {
                    ifLike: like,
                    dislikeComment: ""
                }
            })
        } else {
            await prisma.wxLike.update({
                where: {
                    openId_paperId: {
                        openId: openId,
                        paperId: paperId
                    }
                },
                data: {
                    ifLike: like,
                    dislikeComment: comment
                }
            })
        }
        return {
            message: "like updated successfully",
        };
    });

export default updateLike;
