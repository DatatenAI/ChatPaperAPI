import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {scarchFavoriteSchema} from "@/lib/wx-validation";
import {date} from "zod";


/// 获取用户所有收藏夹，如果没有，则默认创建新收藏夹返回
const scarchFavorite = publicProcedure
    .input(scarchFavoriteSchema)
    .query(async ({input, ctx}) => {
        const { userId,openId } = input;
        const favorites = await prisma.favorite.findMany({
            where: {
                weChatUserId: userId,
                openId: openId
            },
            orderBy: {
                createTime: 'desc',
            },
            include: {
                favoriteDetails: {
                    orderBy: {
                        createTime: 'desc',
                    },
                    include: {
                        paperInfo: true
                    }
                }
            }
        });
        if (favorites.length === 0) {
            const newfav = await prisma.favorite.create({
                data: {
                    weChatUserId: userId,
                    openId: openId,
                    name: "默认收藏夹",
                    createTime: new date()
                },
                select: {},
            })
            favorites.push(newfav)
        }
        return favorites;
    });

export default scarchFavorite;
