import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {searchPaperSchema} from "@/lib/wx-validation";


const searchPaper = publicProcedure
    .input(searchPaperSchema)
    .query(async ({input, ctx}) => {
        const { keywords,pageNum,pageSize } = input
        const keywordList = await prisma.keywords.findMany(
            {
                where: {
                    searchKeywords: {
                        contains: keywords,
                    },
                },
                include: {
                    keywordsPdf: true,
                },
            }
        );
        if (keywordList == null || keywordList.length === 0) {
            return {
                message: "No data was queried",
            };
        }
        const urls = [];
        // 遍历关键词对象数组
        keywordList.forEach((keyword) => {
            // 提取每个对象中的keywordpdf集合
            const keywordsPdf = keyword.keywordsPdf;

            // 遍历keywordpdf集合中的每个对象，提取pdf字段
            keywordsPdf.forEach((keywordPdf) => {
                const pdfUrl = keywordPdf.pdfUrl;
                urls.push(pdfUrl);
            });
        });
        return await prisma.paperInfo.findMany({
            take: pageSize, // 指定每页要获取的结果数量
            skip: (pageNum - 1) * pageSize, // 根据当前页码计算要跳过的结果数量
            where: {
                pdfUrl: {
                    in: urls,
                },
            },
            include: {
                summary: true,
            },
            orderBy: {
                createTime: 'desc',
            },
        });
    });

export default searchPaper;
