import {publicProcedure} from "@/trpc";
import {insertUserSchema} from "@/lib/wx-validation";
import prisma from "@/lib/database";


const insertWxUser = publicProcedure
    .input(insertUserSchema)
    .mutation(async ({input, ctx}) => {
        const {openId,unionId,nickName,avatar,phone,email,gender,birthday,area,educational,interest} = input;
        await prisma.wxUser.upsert({
            where: {
                openId: openId,
            },
            update: {
                nickName: nickName,
                avatar: avatar,
                phone: phone,
                email: email,
                gender: gender,
                birthday: birthday,
                area: area,
                educational: educational,
                interest: interest
            },
            create: {
                openId: openId,
                unionId: unionId,
                nickName: nickName,
                avatar: avatar,
                phone: phone,
                email: email,
                gender: gender,
                birthday: birthday,
                area: area,
                educational: educational,
                interest: interest
            },
        });
        return {
            message: "User information is processed successfully. Procedure",
        };
    });

export default insertWxUser;
