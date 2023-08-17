import prisma from "@/lib/database";
import {searchPaperDetail} from "@/lib/wx-validation";
import {addWxHistory} from '@/trpc/routers/wxhistory/add-history';
import {appPublicProcedure} from "@/trpc/create";



const paperDetail = appPublicProcedure
    .input(searchPaperDetail)
    .query(async ({input, ctx}) => {
        const { paperId} = input
        const detail = await prisma.paperInfo.findUnique({
            where: {
                id: paperId
            },
            include: {
                summary: true,
            }
        });
        const extendedPaper: prisma.paperInfo & {
            likeFlag: number;
            favoriteFlag: boolean;
        } | null = detail ? { ...detail, likeFlag: 0, favoriteFlag: false } : null;
        //查询是否被收藏或者点赞
        if (ctx.session != null && ctx.session.wxuser != null) {
            // 添加浏览历史
            await addWxHistory(ctx.session.wxuser.openid, paperId)
            const wxLike = await prisma.wxLike.findMany({
                where: {
                    openId: ctx.session.wxuser.openid,
                    paperId: paperId
                }
            })
            const favorite = await prisma.favoriteDetails.findMany({
                where: {
                    openId: ctx.session.wxuser.openid,
                    paperId: paperId
                }
            })
            // TODO: do we have len(wxLike) > 1 situation?
            if (wxLike.length > 0) extendedPaper.likeFlag = (wxLike[0].ifLike ? 2 : 1)
            if (favorite.length > 0) extendedPaper.favoriteFlag = true
        }
        return extendedPaper;
    });

export default paperDetail;
