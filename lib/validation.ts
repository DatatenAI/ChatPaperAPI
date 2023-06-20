import z from "zod";
import {TaskState} from "@prisma/client";


const email = z.string().email({message: '请输入正确的邮箱'});
const name = z.string().trim().nonempty({message: "请输入名称"});
const password = z.string().trim().nonempty({message: "请输入密码"}).min(8, "密码最少包含8位字符");

const PageSchema = z.object({
    current: z.number().min(1),
    size: z.number().min(0).max(50),
})

export const SignInSchema = z.object({
    email,
    password
})
export const SignUpSchema = z.object({
    email,
    name,
    password,
});

export const SendMailSchema = z.object({email})


export const ResetPasswordConfirmSchema = z.object({
    password,
    confirmPassword: password.nonempty("请再次输入密码"),
    token: z.string()
}).refine(arg => arg.confirmPassword !== arg.password, {
    message: "两次输入密码不一致",
    path: ["confirmPassword"]
});


export const UpdatePasswordSchema = z.object({
    current: password.nonempty("请输入当前密码"),
    newPassword: password.nonempty("请输入新密码"),
    confirmPassword: password.nonempty("请再次输入密码")
}).refine(arg => arg.confirmPassword === arg.newPassword, {
    message: "两次输入密码不一致",
    path: ["confirmPassword"]
});


export const CreateTaskSchema = z.object({
    pdfHashes: z.optional(z.array(z.string())),
    pdfUrls: z.optional(z.array(z.string().url("请输入正确的链接"))),
    language: z.string(),
}).refine(arg => {
    const isPdfUrlsEmpty = !arg.pdfUrls?.length;
    const isPdfHashesEmpty = !arg.pdfHashes?.length;
    return (isPdfUrlsEmpty !== isPdfHashesEmpty);
}, {
    message: '参数错误',
    path: ['pdfUrls', 'pdfHashes']
})

export const ListTaskSchema = PageSchema.extend({
    state: z.enum(['ALL', ...Object.values(TaskState)]),
})
