import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {searchSchema} from "@/lib/wx-validation";
import {date} from "zod";


/// 获取用户所有收藏文章
const scarchFavoritePaper = publicProcedure
    .input(searchSchema)
    .query(async ({input, ctx}) => {
        let { userId,openId,favoriteId,pageNum,pageSize } = input;
        if (favoriteId == 0) {
            favoriteId = null
        }
        return  await prisma.favoriteDetails.findMany({
            take: pageSize, // 指定每页要获取的结果数量
            skip: (pageNum - 1) * pageSize, // 根据当前页码计算要跳过的结果数量
            where: {
                ...(favoriteId && { favoriteId }),
                weChatUserId: userId,
                openId: openId
            },
            include: {
                paperInfo: true
            },
            orderBy: {
                createTime: 'desc',
            },
        });
    });

export default scarchFavoritePaper;
