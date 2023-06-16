import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {scarchFavoriteSchema} from "@/lib/wx-validation";
import {date} from "zod";


/// 获取用户所有收藏文章
const scarchFavoritePaper = publicProcedure
    .input(scarchFavoriteSchema)
    .query(async ({input, ctx}) => {
        const { userId,openId } = input;
        return await prisma.favoriteDetails.findMany({
            where: {
                weChatUserId: userId,
                openId: openId
            },
            orderBy: {
                createTime: 'desc',
            },
            include: {
                paperInfo: true
            }
        });
    });

export default scarchFavoritePaper;
