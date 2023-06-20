import {Page} from "@/types";
import {Button} from "@/ui/button";
import {IoChevronBackOutline} from "react-icons/io5";
import {AiOutlineShareAlt} from "react-icons/ai";
import React from "react";

const TaskDetail: Page = async props => {
    await new Promise((r) => {
        setTimeout(() => {
            r(null)
        }, 2000);
    })
    console.log(props);
    return <>
        <header className={'w-full h-14 border-b border-gray-200 flex items-center px-4 justify-between'}>
            <Button variant={'secondary'} leftIcon={<IoChevronBackOutline className={'w-4 h-4'}/>} size={"sm"}/>
            <div>
                <Button size={"sm"} leftIcon={<AiOutlineShareAlt/>}>分享</Button>
            </div>
        </header>
    </>
}
export default TaskDetail;