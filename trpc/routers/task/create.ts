import {protectedProcedure} from "@/trpc";
import {CreateTaskSchema} from "@/lib/validation";
import prisma from "@/lib/database";
import {CreditType, Prisma, TaskState, TaskType} from "@prisma/client";
import ApiError from "@/lib/ApiError";
import {uploadRemoteFile} from "@/lib/oss";
import {PDFDocument} from "pdf-lib";
import path from "path";

/**
 * 计算任务消耗credits
 * @param pdfHash 获取pdf页数
 */
const getPdfPages = async (pdfHash: string) => {
    let pages = 0;
    const doc = await PDFDocument.load(path.resolve(process.env.OSS_VOLUME_PATH, 'uploads', `${pdfHash}.pdf`));
    return doc.getPages().length;
};

const create = protectedProcedure
    .input(CreateTaskSchema)
    .mutation(async ({input, ctx}) => {
        const pdfHashes: string[] = [];
        if (input.pdfHashes?.length) {
            for (let pdfHash of input.pdfHashes) {
                if (!pdfHashes.includes(pdfHash)) {
                    pdfHashes.push(pdfHash);
                }
            }
        } else {
            if (input.pdfUrls?.length) {
                const uploadFiles = await Promise.all(
                    input.pdfUrls.map((url) => {
                        return uploadRemoteFile(url, "uploads");
                    })
                );
                for (let uploadFile of uploadFiles) {
                    if (!pdfHashes.includes(uploadFile.hash)) {
                        pdfHashes.push(uploadFile.hash);
                    }
                }
            }
        }
        if (!pdfHashes.length) {
            throw new ApiError("pdf为空");
        }
        const credit = await prisma.credit.findUnique({
            where: {
                userId: ctx.session.user.id,
            },
        });
        let taskType: TaskType = TaskType.SUMMARY;
        let hasSame = false;
        const allSameTasks = await prisma.task.findMany({
            where: {
                pdfHash: {
                    in: pdfHashes,
                },
                state: TaskState.SUCCESS,
            },
        });
        const tasks: Prisma.TaskCreateManyInput[] = await Promise.all(pdfHashes.map(async (it) => {
            let taskType: TaskType;
            const sameHashTasks = allSameTasks.filter((task) => task.pdfHash === it)
            if (sameHashTasks.length) {
                taskType = TaskType.TRANSLATE;
            } else {
                taskType = TaskType.SUMMARY;
            }
            const sameLanguageTask = sameHashTasks.findIndex(task => task.language === input.language) >= 0;
            return {
                type: taskType,
                userId: ctx.session.user.id,
                language: input.language,
                pdfHash: it,
                pages: await getPdfPages(it),
                costCredits: new Prisma.Decimal(0),
                state: sameLanguageTask ? TaskState.SUCCESS : TaskState.RUNNING,
            };
        }));


        const costCredits = tasks.reduce((sum, task) => {
            return sum.add(task.pages * (task.type === TaskType.SUMMARY ? 1 : 0.5));
        }, new Prisma.Decimal(0));


        if (credit) {
            if (credit.gift.add(credit.purchase).lessThan(costCredits)) {
                throw new ApiError("可用点数不够");
            }
            const giftCost = credit.gift.gte(costCredits) ? costCredits : credit.gift;
            let surplusCredits = new Prisma.Decimal(0);
            if (costCredits.gt(credit.gift)) {
                surplusCredits = costCredits.sub(credit.gift);
            }
            if (credit.purchase.lt(surplusCredits)) {
                throw new ApiError("可用点数不够");
            }
            const purchaseCost = surplusCredits;
            await prisma.$transaction(async trx => {
                let newVar = await trx.task.createMany({
                    data: tasks
                });
            });
        }


        if (credit) {
            let creditType: CreditType | undefined;
            const giftCost = credit.gift.lte(costCredits) ? costCredits : credit.gift;

            if (credit.gift.lte(costCredits)) {
                creditType = CreditType.GIFT;
            } else if (credit.purchase.lte(costCredits)) {
                creditType = CreditType.PURCHASE;
            }
            if (creditType) {
                await prisma.$transaction(async (trx) => {
                    await trx.task.create({
                        data: {
                            pdfHash: input.pdfHash,
                            type: taskType,
                            userId: ctx.session.user.id,
                            language: input.language,
                            state: hasSame ? TaskState.SUCCESS : TaskState.RUNNING,
                        },
                    });
                    const where: Prisma.CreditUpdateArgs["where"] = {
                        userId: ctx.session.user.id,
                    };
                    const data: Prisma.CreditUpdateArgs["data"] = {};
                    if (creditType === CreditType.GIFT) {
                        where.gift = credit.gift;
                        data.gift = {
                            increment: -costCredit,
                        };
                        data.frozenGift = {
                            increment: costCredit,
                        };
                    } else {
                        where.purchase = credit.purchase;
                        data.purchase = {
                            increment: -costCredit,
                        };
                        data.frozenPurchase = {
                            increment: costCredit,
                        };
                    }
                    await trx.credit.update({
                        where,
                        data,
                    });
                    await trx.creditHistory.create({
                        data: {
                            userId: ctx.session.user.id,
                            creditType: creditType!,
                            amount: -costCredit,
                        },
                    });
                });
            }
        }
        throw new ApiError("可用点数不够");
    });

export default create;
