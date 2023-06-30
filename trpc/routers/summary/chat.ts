import {protectedProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {ChatStatus, CreditType, Prisma, Summary} from "@prisma/client";
import {ChatSchema} from "@/lib/validation";
import ApiError from "@/lib/ApiError";
import {queryEmbedding, queryForSearchChat, queryForSummaryChat} from "@/lib/openai";
import {TRPCError} from "@trpc/server";
import milvusClient from "@/lib/milvus";
import {DataType} from "@zilliz/milvus2-sdk-node";

const Chat = protectedProcedure
    .input(ChatSchema)
    .mutation(async ({
                         input,
                         ctx
                     }) => {
        let summary: Summary | null = null;
        if (input.summaryId) {
            summary = await prisma.summary.findUnique({
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
        }

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
        let embedding: number[] | null = null;
        try {
            embedding = await queryEmbedding(input.question)
        } catch (e) {
            ctx.logger.error(e, "查询embedding异常");
            chat.status = ChatStatus.FAILED;
            chat.reply = '网络异常';
        }
        if (embedding) {
            if (summary) {
                const searchRes = await milvusClient.search({
                    collection_name: 'SinglePaperDocVector',
                    search_params: {
                        anns_field: 'chunk_vector',
                        topk: '4',
                        metric_type: 'IP',
                        params: JSON.stringify({
                            nprobe: 32,
                        })
                    },
                    output_fields: ['sql_id'],
                    vector_type: DataType.FloatVector,
                    vectors: [embedding],
                });
                if (searchRes.results.length) {
                    const chunks = await prisma.paperChunk.findMany({
                        where: {
                            id: {
                                in: searchRes.results.map(it => Number(it.sql_id)),
                            }
                        }
                    });
                    try {
                        chat.status = ChatStatus.SUCCESS;
                        const reply = await queryForSummaryChat(input.language, summary.basicInfo, input.question, chunks.map(chunk => chunk.text).join("\n"));
                        chat.reply = reply;
                    } catch (e) {
                        ctx.logger.error(e, "对话查询openai异常");
                        chat.status = ChatStatus.FAILED;
                        chat.reply = '网络异常';
                    }
                } else {
                    chat.status = ChatStatus.FAILED;
                    chat.reply = '很抱歉，我无法回答这个问题';
                }
            } else {
                const searchRes = await milvusClient.search({
                    collection_name: 'PaperSummaryDocVector',
                    search_params: {
                        anns_field: 'summary_vector',
                        topk: '4',
                        metric_type: 'IP',
                        params: JSON.stringify({
                            nprobe: 32,
                        })
                    },
                    output_fields: ['sql_id'],
                    vector_type: DataType.FloatVector,
                    vectors: [embedding],
                });
                if (searchRes.results.length) {
                    const summaries = await prisma.summary.findMany({
                        where: {
                            id: {
                                in: searchRes.results.map(it => it.sql_id),
                            }
                        }
                    });
                    try {
                        chat.status = ChatStatus.SUCCESS;
                        chat.reply = await queryForSearchChat(input.language, input.question, summaries.map(summary => summary.content).join("\n"));
                    } catch (e) {
                        ctx.logger.error(e, "对话查询openai异常");
                        chat.status = ChatStatus.FAILED;
                        chat.reply = '网络异常';
                    }
                } else {
                    chat.status = ChatStatus.FAILED;
                    chat.reply = '很抱歉，我无法回答这个问题';
                }
            }

        }
        const updates: Prisma.PrismaPromise<any>[] = [prisma.chat.update({
            where: {
                id: chat.id
            },
            data: {
                reply: chat.reply,
                status: chat.status,
            }
        })];
        if (chat.status === ChatStatus.FAILED) {
            updates.push(prisma.user.update({
                where: {
                    id: ctx.session.user.id
                },
                data: {
                    credits: {
                        increment: 0.5
                    }
                }
            }), prisma.creditHistory.create({
                data: {
                    userId: ctx.session.user.id,
                    type: CreditType.CHAT,
                    amount: 0.5,
                }
            }));
        }
        await prisma.$transaction(updates);
        return {
            reply: chat.reply,
            status: chat.status,
        };
    });


export default Chat;
