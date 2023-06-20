"use client";
import React, {FC} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/ui/avatar";
import {User} from "next-auth";
import {BiCreditCard, BiLogOut, BiUser} from "react-icons/bi";
import {BsDiscord} from "react-icons/bs";
import {RxAvatar} from "react-icons/rx";
import Link from "next/link";
import {MdDataUsage} from "react-icons/md";
import {signOut} from "next-auth/react";

const UserAvatar: FC<{
    user: User
}> = ({user}) => {

    const logout = async () => {
        await signOut();
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className={'w-8 h-8 cursor-pointer'}>
                    <AvatarImage src={user.image!}/>
                    <AvatarFallback><RxAvatar/></AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 font-medium text-gray-700">
                <DropdownMenuLabel className={'flex gap-3 text-sm'}>
                    <Avatar>
                        <AvatarImage src={user.image!}/>
                        <AvatarFallback><BiUser/></AvatarFallback>
                    </Avatar>
                    <div>
                        <div>{user.name}</div>
                        <div className={'font-normal text-gray-700'}>{user.email}</div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href={'/settings/profile'} prefetch={false}>
                            <BiUser className="mr-2 h-4 w-4"/>
                            <span>个人信息</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={'/settings/billing'} prefetch={false}>
                            <BiCreditCard className="mr-2 h-4 w-4"/>
                            <span>账户余额</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={'/settings/billing'} prefetch={false}>
                            <MdDataUsage className="mr-2 h-4 w-4"/>
                            <span>用量明细</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <BsDiscord className="mr-2 h-4 w-4"/>
                        <span>加入群组</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={logout}>
                    <BiLogOut className="mr-2 h-4 w-4"/>
                    <span>退出登录</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};


export default UserAvatar;