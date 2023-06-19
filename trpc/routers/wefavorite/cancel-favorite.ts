import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {insertFavoriteSchema} from "@/lib/wx-validation";
import {date} from "zod";


/// 取消收藏
const cancelFavorite = publicProcedure
    .input(insertFavoriteSchema)
    .query(async ({input, ctx}) => {
        const {userId,openId,favoriteId} = input;
        await prisma.favoriteDetails.delete({
            where: {
                openId: openId,
                favoriteId: favoriteId,
                weChatUserId: userId
            },
        })
        return {
            message: "Favorite delete successfully",
        };
    });

export default cancelFavorite;
