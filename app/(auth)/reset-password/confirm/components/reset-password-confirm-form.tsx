"use client";
import React, {FC, useState} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ResetPasswordConfirmSchema} from "@/lib/validation";
import {trpc} from "@/lib/trpc";
import {Label} from "@/ui/label";
import {Input} from "@/ui/input";
import {Button} from "@/ui/button";
import z from "zod";
import {useToast} from "@/ui/use-toast";

type FormData = z.infer<typeof ResetPasswordConfirmSchema>
const ResetPasswordConfirmForm: FC<{
    email: string
}> = props => {


    const {toast} = useToast();


    const [sendSuccess, toggleSendSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm<FormData>({
        resolver: zodResolver(ResetPasswordConfirmSchema)
    });

    const resetPasswordMutation = trpc.auth.resetPassword.useMutation({
        onError: error => {
            toast({
                title: error.message,
                variant: "destructive"
            });
        },
        onSuccess: data => {
            toggleSendSuccess(true);
        }
    });
    const resetPassword = async (formData: FormData) => {
        resetPasswordMutation.mutate(formData);
    };

    return <>
        {
            sendSuccess ?
                <div className={"text-center font-medium text-gray-600 dark:text-gray-300"}>
                    <p>Password Reset Successful</p>
                    <p>Your password has been successfully reset. Please login again with your new password to access
                        your
                        account.</p>
                </div> :
                <form onSubmit={handleSubmit(resetPassword)} className="flex flex-col gap-5">
                    <div className="space-y-1.5">
                        <Label htmlFor={"email"}>Email
                            address</Label>
                        <Input
                            placeholder="Email address"
                            type={"email"}
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            value={props.email}
                            readOnly
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor={"password"}>New password</Label>
                        <Input
                            placeholder="•••••••••••••"
                            type={"password"}
                            autoComplete="new-password"
                            {...register("password")}
                            error={errors.password?.message}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor={"confirmPassword"}>Confirm password</Label>
                        <Input
                            placeholder="•••••••••••••"
                            type={"password"}
                            autoComplete="off"
                            {...register("confirmPassword", {
                                validate: (value, formValues) => {
                                    if (formValues.password !== value) {
                                        return "Passwords do not match"
                                    }
                                    return undefined;
                                }
                            })}
                            error={errors.confirmPassword?.message}
                        />
                    </div>
                    <Button type={"submit"} size={"lg"}>Reset password</Button>
                </form>
        }
    </>;
};


export default ResetPasswordConfirmForm;