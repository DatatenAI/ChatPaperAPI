import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {insertFavoriteSchema} from "@/lib/wx-validation";
import {date} from "zod";


/// 添加收藏
const addFavoritePaper = publicProcedure
    .input(insertFavoriteSchema)
    .mutation(async ({input, ctx}) => {
        const {userId,openId,favoriteId,paperId,source} = input;
        await prisma.favoriteDetails.create({
            data: {
                weChatUserId: userId,
                openId: openId,
                favoriteId: favoriteId,
                paperId: paperId,
                source: source,
                createTime: new Date()
            }
        })
        return {
            message: "Favorite added successfully",
        };
    });

export default addFavoritePaper;
