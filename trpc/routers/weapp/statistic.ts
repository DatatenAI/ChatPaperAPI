import prisma from "@/lib/database";
import {searchSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";


/// 统计信息接口
const statistic = appProtectedProcedure
    .input(searchSchema)
    .query(async ({input, ctx}) => {
        const {userId,openId} = input
        const keywordsSize = await prisma.subscribeKeywords.findMany({
            where: {
                weChatUserId: userId,
                openId: openId
            }
        });
        const favoriteSize = await prisma.favoriteDetails.findMany({
            where: {
                weChatUserId: userId,
                openId: openId
            }
        });
        const likeSize = await prisma.wxLike.findMany({
            where: {
                weChatUserId: userId,
                openId: openId
            }
        });
        const historySize = await prisma.wxHistory.findMany({
            where: {
                weChatUserId: userId,
                openId: openId
            }
        });
        return{
            "keywordsSize":keywordsSize.length,
            "favoriteSize":favoriteSize.length,
            "likeSize":likeSize.length,
            "historySize":historySize.length,
        }
    });

export default statistic;
