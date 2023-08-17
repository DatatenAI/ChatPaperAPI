import prisma from "@/lib/database";
import {searchConferencePaperSchema} from "@/lib/wx-validation";
import {appPublicProcedure} from "@/trpc/create";
import {flag} from "arg";


const searchConferencePaper = appPublicProcedure
    .input(searchConferencePaperSchema)
    .query(async ({input, ctx}) => {
        const {conference, year, pageNum, pageSize} = input
        const paperList = await prisma.paperInfo.findMany({
            take: pageSize, // 指定每页要获取的结果数量
            skip: (pageNum - 1) * pageSize, // 根据当前页码计算要跳过的结果数量
            where: {
                conference: conference,
                summary: {
                    some: {
                        pdfHash: {
                            not: undefined
                        }
                    }
                },
                pubTime: {
                    gte: new Date(year, 0), // the first day of the first month
                    lte: new Date(year, 12) // the first day of the next year
                }
            },
            include: {
                summary: {
                    select: {
                        titleZh: true
                    }
                }
            },
            orderBy: {
                createTime: 'desc',
            },
        });
        const resultList: (prisma.paperInfo & { waitFlag: boolean })[] = paperList.map(
            (paper) => ({
                ...paper,
                waitFlag: false,
            })
        );
        resultList.forEach(item => {
            // no need for pages
            item.abstract = ""
        })
        //查询是否被加入待阅
        if (ctx.session != null && ctx.session.wxuser != null) {
            const ids = resultList.map(obj => obj.id);
            const waitList = await prisma.wxWaitRead.findMany({
                where: {
                    openId: ctx.session.wxuser.openid,
                    paperId: {
                        in: ids
                    }
                }
            })
            resultList.forEach(item => {
                const waitItem = waitList.find(waitItem => waitItem.paperId === item.id);
                if (waitItem) {
                    item.waitFlag = true
                }
            })
        }
        return resultList;
    });

export default searchConferencePaper;
