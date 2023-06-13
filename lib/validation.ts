import z from "zod";


const email = z.string().email();
const name = z.string().trim().nonempty({message: "请输入名称"});
const password = z.string().trim().nonempty({message: "请输入密码"}).min(8, "密码最少包含8位字符");


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

