import prisma from "@/lib/database";
import {deleteFavoriteSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";


/// 添加收藏夹
const deleteFavorite = appProtectedProcedure
    .input(deleteFavoriteSchema)
    .mutation(async ({ input, ctx }) => {
        const { userId, openId, favoriteId } = input;
        // console.log('####$$$$$$delete')
        const existingFavorite = await prisma.favorite.findUnique({
          where: {
            id: favoriteId,
            openId: openId,
          },
        });
    
        if (!existingFavorite) {
          throw new Error(`Favorite with ID ${favoriteId} not found.`);
        }
    
        const deletedFavorite = await prisma.favorite.delete({
          where: {
            id: favoriteId,
          },
        });
    
        return {
          message: "Favorite deleted successfully",
          deletedFavorite,
        };
      });

export default deleteFavorite;
