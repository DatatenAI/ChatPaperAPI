import prisma from "@/lib/database";
import {insertFavoriteSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";


/// 添加收藏夹
const addFavorite = appProtectedProcedure
    .input(insertFavoriteSchema)
    .query(async ({input, ctx}) => {
        const {userId,openId,favoriteName} = input;
        await prisma.favorite.create({
            data: {
                weChatUserId: userId,
                openId: openId,
                name: favoriteName,
                createTime: new Date()
            }
        })
        return {
            message: "Favorite added successfully",
        };
    });

export default addFavorite;
