import {Layout} from "@/types";
import Image from "next/image";
import Logo from "@/public/logo.jpeg";
import React from "react";

const AuthLayout: Layout = async (props) => {
    return <div
        className={"w-screen h-screen bg-white dark:bg-gray-900"}>
        <div className={'flex items-center fixed left-8 top-8'}>
            <Image src={Logo} alt={"logo"} className={'w-10 h-10 rounded-lg'}/>
            <span className={'font-bold text-xl ml-2'}>ChatPaper</span>
        </div>
        <div className="container h-full flex justify-center  items-center">
            <div className={'sm:min-w-[360px] flex flex-col gap-8'}>
                {props.children}
            </div>
        </div>
    </div>;
};
export default AuthLayout;
