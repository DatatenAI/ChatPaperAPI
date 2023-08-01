import prisma from "@/lib/database";
import {editFavoriteSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";


/// 添加收藏夹
const editFavorite = appProtectedProcedure
    .input(editFavoriteSchema)
    .query(async ({input, ctx}) => {
        const {openId,favoriteName,favoriteId} = input;
        console.log("#######@@@@@@@@@@ ",input)
        const existingFavorite = await prisma.favorite.findUnique({
            where: { id: favoriteId,
                openId: openId },

          });
        if (!existingFavorite) {
            throw new Error(`Favorite with ID ${favoriteId} not found.`);
        }

        const updatedFavorite = await prisma.favorite.update({
            where: { id: favoriteId },
            data: { name: favoriteName },
        });
        return {
            message: "Favorite name updated successfully",
            updatedFavorite,
        };
    });

export default editFavorite;
