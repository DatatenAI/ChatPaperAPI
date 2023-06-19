import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {scarchFavoriteSchema} from "@/lib/wx-validation";
import {date} from "zod";


/// 获取用户所有收藏文章
const scarchFavoritePaper = publicProcedure
    .input(scarchFavoriteSchema)
    .query(async ({input, ctx}) => {
        const { userId,openId } = input;
        const favoriteDateilList = await prisma.favoriteDetails.findMany({
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
        // 关联查询照片
        if (favoriteDateilList.length > 0) {
            const imgList = await prisma.paperImage.findMany(
                {
                    where: {
                        searchKeywords: {
                            contains: keywords,
                        },
                    }
                }
            );
            favoriteDateilList.forEach((item) => {
                const matchedImages = imgList.filter((image) =>
                    item.paperInfo.keywords.includes(image.keywords)
                );
                if (matchedImages.length > 0) {
                    const randomIndex = Math.floor(Math.random() * matchedImages.length);
                    item.paperInfo.viewImg = matchedImages[randomIndex];
                }else {
                    item.paperInfo.viewImg = null;
                }
            });
        }

    });

export default scarchFavoritePaper;
