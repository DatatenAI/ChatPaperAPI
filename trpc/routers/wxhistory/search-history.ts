import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {searchSchema} from "@/lib/wx-validation";


const searchHistory = publicProcedure
    .input(searchSchema)
    .query(async ({input, ctx}) => {
        const {userId,openId,pageNum,pageSize } = input;
        return await prisma.wxHistory.findMany({
            take: pageSize, // 指定每页要获取的结果数量
            skip: (pageNum - 1) * pageSize, // 根据当前页码计算要跳过的结果数量
            where: {
                openId: openId,
                weChatUserId: userId
            },
            include: {
                paperInfo: true,
            },
            orderBy: {
                createTime: 'desc'
            }
        });
    });

export default searchHistory;
