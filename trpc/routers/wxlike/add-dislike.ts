
import prisma from "@/lib/database";
import {addDislikeSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";



/// 点赞
const addDislike = appProtectedProcedure
    .input(addDislikeSchema)
    .query(async ({input, ctx}) => {
        const {openId, paperId, comment} = input;
        await prisma.wxLike.create({
            data: {
                openId: openId,
                paperId: paperId,
                createTime: new Date(),
                ifLike: false,
                dislikeComment: comment
            }
        })
        return {
            message: "dislike added successfully",
        };
    });

export default addDislike;
