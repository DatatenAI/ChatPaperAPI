import React from 'react';
import Logo from "@/public/logo.jpeg";
import Image from "next/image";
import Link from "next/link";
import NavLinks from "./nav-links";
import UserAvatar from "@/app/(business)/(normal)/user-avatar";
import {getCurrentUser} from "@/lib/auth";
import {AsyncComponent} from "@/types";


const ApplicationHeader: AsyncComponent = async props => {
    const user = await getCurrentUser();
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
                <div className={'ml-auto'}>
                    <UserAvatar user={user}/>
                </div>
            </nav>
        </header>
    );
};


export default ApplicationHeader;