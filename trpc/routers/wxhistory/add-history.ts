import prisma from "@/lib/database";

export async function addWxHistory(userId: String, openId: String, paperId: String): Promise<void> {
    await prisma.wxHistory.upsert({
        where: {
            weChatUserId_openId_paperId: {
                weChatUserId: userId,
                openId: openId,
                paperId: paperId
            }
        },
        update: {
            createTime: new Date()
        },
        create: {
            weChatUserId: userId,
            openId: openId,
            paperId: paperId,
            createTime: new Date()
        },
    });
}

export default addWxHistory;





