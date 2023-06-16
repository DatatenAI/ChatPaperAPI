import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {insertFavoriteSchema} from "@/lib/wx-validation";
import {date} from "zod";


/// 添加收藏
const insertFavorite = publicProcedure
    .input(insertFavoriteSchema)
    .query(async ({input, ctx}) => {
        const {userId,openId,favoriteId,source} = input;
        await prisma.favoriteDetails.create({
            data: {
                weChatUserId: userId,
                openId: openId,
                favoriteId: favoriteId,
                source: source,
                createTime: new date()
            },
            select: {},
        })
        return {
            message: "Favorite added successfully",
        };
    });

export default insertFavorite;
