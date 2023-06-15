import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {searchPaperSchema} from "@/lib/wx-validation";


const searchPaper = publicProcedure
    .input(searchPaperSchema)
    .query(async ({input, ctx}) => {
        const { keywords } = input
        const keywordList = await prisma.keywords.findMany(
            {
                where: {
                    searchKeywords: {
                        contains: keywords,
                    },
                }
            }
        );
        if (keywordList == null || keywordList.length === 0) {
            return {
                message: "No data was queried",
            };
        }
        const urls = keywordList.map((keyword) => keyword.pdfUrl);
        const paperInfoList = await prisma.paperInfo.findMany({
            where: {
                pdfUrl: {
                    in: urls,
                },
            },
            include: {
                paperSummary: true,
            },
            orderBy: {
                createTime: 'desc',
            },
        });
        // 关联查询照片
        const imgList = await prisma.paperImage.findMany(
            {
                where: {
                    searchKeywords: {
                        contains: keywords,
                    },
                }
            }
        );
        paperInfoList.forEach((info) => {
            const matchedImages = imgList.filter((image) =>
                info.keywords.includes(image.keywords)
            );
            if (matchedImages.length > 0) {
                const randomIndex = Math.floor(Math.random() * matchedImages.length);
                info.viewImg = matchedImages[randomIndex];
            }else {
                info.viewImg = null;
            }
        });
        return paperInfoList;
    });

export default searchPaper;
