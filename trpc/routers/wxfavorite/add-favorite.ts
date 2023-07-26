import prisma from "@/lib/database";
import {addFavoriteSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";


/// 添加收藏夹
const addFavorite = appProtectedProcedure
    .input(addFavoriteSchema)
    .query(async ({input, ctx}) => {
        const {openId,favoriteName} = input;
        await prisma.favorite.create({
            data: {
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
