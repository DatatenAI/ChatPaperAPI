import React from 'react';
import Logo from "@/public/logo.jpeg";
import Image from "next/image";
import Link from "next/link";
import NavLinks from "./nav-links";
import UserAvatar from "@/app/(business)/(normal)/user-avatar";
import {getCurrentUser} from "@/lib/auth";
import {AsyncComponent} from "@/types";
import DailyCheckInButton from "@/app/(business)/(normal)/daily-check-in-button";
import prisma from "@/lib/database";
import {CreditType} from "@prisma/client";
import dayjs from "dayjs";


const ApplicationHeader: AsyncComponent = async props => {
    const user = await getCurrentUser();
    const checked = user ? (await prisma.creditHistory.count({
            where: {
                userId: user.id,
                type: CreditType.CHECK_IN,
                happenedAt: {
                    gte: dayjs().startOf('day').toDate(),
                }
            }
        })
    ) > 0 : false;
    return (
        <header className={'sticky top-0 z-40 border-b bg-background'}>
            <nav className={'container h-16 flex  items-center'}>
                <Link href={'/home'} className={'inline-flex items-center gap-2'} prefetch={false}>
                    <Image src={Logo} className={'w-10 h-10 rounded-xl'} alt={"logo"}/>
                    <span className={'font-bold text-xl'}>ChatPaper</span>
                </Link>
                <div className={'ml-8'}>
                    <NavLinks/>
                </div>
                <div className={'ml-auto flex gap-4'}>
                    <DailyCheckInButton checked={checked}/>
                    <UserAvatar user={user}/>
                </div>
            </nav>
        </header>
    );
};


export default ApplicationHeader;