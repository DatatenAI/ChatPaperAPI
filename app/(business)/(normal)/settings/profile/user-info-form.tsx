'use client';
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/ui/form";
import {Input} from "@/ui/input";
import {Button} from "@/ui/button";
import React, {FC} from "react";
import z from "zod";
import {UpdateInfoSchema,} from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {useToast} from "@/ui/use-toast";
import {trpc} from "@/lib/trpc";
import {Avatar, AvatarFallback, AvatarImage} from "@/ui/avatar";
import {BiUserCircle} from "@react-icons/all-files/bi/BiUserCircle";
import {useSession} from "next-auth/react";

type FormData = z.infer<typeof UpdateInfoSchema>
const UserInfoForm: FC<{
    defaultValues: FormData
}> = props => {

    const {toast} = useToast();

    const session = useSession();

    const updateMutation = trpc.account.updateInfo.useMutation({
        onSuccess: () => {
            toast({
                title: '操作成功',
                description: `信息已修改`,
            });
            session.update();
        }
    });

    const form = useForm<FormData>({
        resolver: zodResolver(UpdateInfoSchema),
        defaultValues: props.defaultValues,
    });

    const onSubmit = (formData:FormData) => {
        updateMutation.mutate(formData)
    }
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="avatar"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>头像</FormLabel>
                        <FormControl>
                            <Avatar className={'w-20 h-20'}>
                                <AvatarImage src={field.value}/>
                                <AvatarFallback><BiUserCircle/></AvatarFallback>
                            </Avatar>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>名称</FormLabel>
                        <FormControl>
                            <Input placeholder="请输入名称" {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <Button type="submit" loading={updateMutation.isLoading}>更新</Button>
        </form>
    </Form>
};


export default UserInfoForm;