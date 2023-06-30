import React, {FC} from 'react';
import {Button} from "@/ui/button";
import {IoChevronBackOutline} from "@react-icons/all-files/io5/IoChevronBackOutline";
import Link from "next/link";

const Header: FC<{
    title: string;
    logined: boolean;
    extra?: React.ReactElement;
}> = ({
          title,
          extra,
          logined
      }) => {
    return (
        <header className={'w-full h-16 fixed inset-0 border-b border-gray-200 flex items-center px-4 justify-between'}>
            {
                logined ? <Link href={'/tasks'} prefetch={false}>
                    <Button variant={'secondary'} leftIcon={<IoChevronBackOutline className={'w-4 h-4'}/>} size={"sm"}/>
                </Link> : null
            }
            <h1 className={'font-semibold'}>{title}</h1>
            <div>
                {extra}
            </div>
        </header>
    );
};


export default Header;