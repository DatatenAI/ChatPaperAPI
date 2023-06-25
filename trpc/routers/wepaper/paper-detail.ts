import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {searchPaperDetail} from "@/lib/wx-validation";
import { addWxHistory } from '@/trpc/routers/wxhistory/add-history';


const paperDetail = publicProcedure
    .input(searchPaperDetail)
    .query(async ({input, ctx}) => {
        const { paperId,userId,openId } = input
        const detail = await prisma.paperInfo.findUnique({
            where: {
                id:paperId
            },
            include: {
                summary: true,
            }
        });
        detail.likeFlag = false
        detail.favoriteFlag = false
        //查询是否被收藏或者点赞
        if (userId != null && openId != null) {
            // 添加浏览历史
            await addWxHistory(userId, openId, paperId)
            const wxLike = await prisma.wxLike.findMany({
                where: {
                    weChatUserId: userId,
                    openId: openId,
                    paperId: paperId
                }
            })
            const favorite = await prisma.favoriteDetails.findMany({
                where: {
                    weChatUserId: userId,
                    openId: openId,
                    paperId: paperId
                }
            })
            if (wxLike.length > 0) detail.likeFlag = true
            if (favorite.length > 0) detail.favoriteFlag = true
        }

        return detail;
    });

export default paperDetail;
