import prisma from "@/lib/database";
import {insertFavoriteSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";


/// 取消收藏
const cancelFavorite = appProtectedProcedure
    .input(insertFavoriteSchema)
    .query(async ({input, ctx}) => {
        const {userId,openId,paperId} = input;
        await prisma.favoriteDetails.delete({
            where: {
                weChatUserId_openId_paperId: {
                    weChatUserId: userId,
                    openId: openId,
                    paperId: paperId
                }
            },
        })
        return {
            message: "Favorite delete successfully",
        };
    });

export default cancelFavorite;
