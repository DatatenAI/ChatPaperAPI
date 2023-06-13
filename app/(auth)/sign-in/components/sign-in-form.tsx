"use client";
import React, {FC} from "react";
import {SignInSchema} from "@/lib/validation";
import {Button} from "@/ui/button";
import {useForm} from "react-hook-form";
import {signIn} from "next-auth/react";
import {zodResolver} from "@hookform/resolvers/zod";
import z from "zod";
import Link from "next/link";
import {Label} from "@/ui/label";
import {useToast} from "@/ui/use-toast";
import {Input} from "@/ui/input";


type FormData = z.infer<typeof SignInSchema>
const SignInForm: FC = props => {
    const {toast} = useToast();

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm<FormData>({
        resolver: zodResolver(SignInSchema)
    });


    const signWithEmail = async (data: FormData) => {
        const signInResult = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false
        });
        if (!signInResult?.ok || signInResult?.error) {
            toast({
                title: signInResult?.error || "Your sign in request failed. Please try again.",
                variant: "destructive"
            });
        } else {
            window.location.href = signInResult.url ?? "/";
        }
    };


    return <form onSubmit={handleSubmit(signWithEmail)} className="flex flex-col gap-5">
        <div className="space-y-1.5">
            <Label htmlFor={"email"}>邮箱</Label>
            <Input
                placeholder="请输入邮箱"
                type={"email"}
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                {...register("email")}
                error={errors.email?.message}
            />
        </div>
        <div className="space-y-1.5">
            <Label htmlFor={"password"}>密码</Label>
            <Input
                placeholder="•••••••••••••"
                type="password"
                autoComplete={"current-password"}
                {...register("password")}
                error={errors.password?.message}
                autoFocus
            />
        </div>
        <Link prefetch={false} href={"/reset-password"}
              className={"text-primary text-sm font-semibold"}>忘记密码？</Link>
        <Button type={"submit"} loading={isSubmitting}>登录</Button>
    </form>;
};


export default SignInForm;