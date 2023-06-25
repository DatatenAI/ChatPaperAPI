import {protectedProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {ChatStatus, CreditType} from "@prisma/client";
import {ChatSchema} from "@/lib/validation";
import ApiError from "@/lib/ApiError";
import {queryEmbedding} from "@/lib/openai";
import {TRPCError} from "@trpc/server";

const Chat = protectedProcedure
    .input(ChatSchema)
    .mutation(async ({input, ctx}) => {
        const pdfHashes: string[] = [];
        if (input.summaryId) {
            const summary = await prisma.summary.findUnique({
                where: {
                    id: input.summaryId,
                }
            });
            if (!summary) {
                throw new ApiError("总结不存在");
            }
            const hasRunning = await prisma.chat.count({
                where: {
                    summaryId: input.summaryId,
                    userId: ctx.session.user.id,
                    status: ChatStatus.RUNNING,
                },
            })
            if (hasRunning) {
                throw new TRPCError({
                    code: "TOO_MANY_REQUESTS",
                    message: '请勿频繁请求',
                });
            }
            pdfHashes.push(summary.pdfHash);
        }

        const embedding = await queryEmbedding(input.question);
        let chat = await prisma.$transaction(async (trx) => {
            await trx.user.update({
                where: {
                    id: ctx.session.user.id,
                    credits: {
                        gte: 0.5
                    }
                },
                data: {
                    credits: {
                        increment: -0.5
                    }
                }
            });
            await trx.creditHistory.create({
                data: {
                    userId: ctx.session.user.id,
                    type: CreditType.CHAT,
                    amount: -0.5,
                }
            });
            return await trx.chat.create({
                data: {
                    userId: ctx.session.user.id,
                    summaryId: input.summaryId,
                    language: input.language,
                    pages: [],
                    status: ChatStatus.RUNNING,
                    questionedAt: new Date(),
                    question: input.question,
                }
            });
        });

        //todo 查询
        chat = await prisma.chat.update({
            where: {
                id: chat.id
            },
            data: {
                reply: input.question,
                status: ChatStatus.SUCCESS,
            }
        });
        return chat.reply;
    })


export default Chat;
