import {hashToken} from "@/lib/auth";
import prisma from "@/lib/database";
import {sendMail} from "@/lib/mail";
import {SignUpSchema} from "@/lib/validation";
import {publicProcedure} from "@/trpc";
import {VerificationTokenType} from "@prisma/client";
import {randomBytes} from "crypto";
import ApiError from "@/lib/ApiError";

const signUp = publicProcedure
    .input(SignUpSchema)
    .mutation(async ({input, ctx}) => {
        const {email, password, name} = input;
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (user && user.emailVerified) {
            throw new ApiError("邮箱已注册");
        }
        const hashedPassword = hashToken(input.password);
        const token = randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 86400 * 1000);
        await prisma.verificationToken.create({
            data: {
                identifier: input.email,
                token: hashToken(token),
                type: VerificationTokenType.register,
                expires,
            },
        });
        const params = new URLSearchParams({token});
        const link = `${process.env.NEXTAUTH_URL}/verify-email?${params}`;
        try {
            await prisma.$transaction(async trx => {
                await trx.user.upsert({
                    where: {
                        email,
                    },
                    update: {
                        password: hashedPassword,
                        name,
                    },
                    create: {
                        language: '中文',
                        email,
                        name,
                        password: hashedPassword,
                    },
                });
                await sendMail("register", {
                    to: email,
                    subject: "验证邮箱已完成注册",
                    params: {
                        link,
                    },
                });
            })
        } catch (e) {
            throw new ApiError('发送邮件失败，请重试');
        }
        return {
            message: "邮件已发送",
        };
    });

export default signUp;
