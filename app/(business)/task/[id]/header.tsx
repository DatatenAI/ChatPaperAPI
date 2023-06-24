import React, {FC} from 'react';
import {Button} from "@/ui/button";
import {IoChevronBackOutline} from "react-icons/io5";
import Link from "next/link";
import {Task} from "@prisma/client";
import TaskStateBadge from "@/components/task-state-badge";

const TaskHeader: FC<{
    task: Pick<Task, 'pdfHash' | 'language' | 'state'>
}> = ({task}) => {
    return (
        <header className={'w-full h-16 fixed inset-0 border-b border-gray-200 flex items-center px-4 justify-between'}>
            <Link href={'/tasks'} prefetch={false}>
                <Button variant={'secondary'} leftIcon={<IoChevronBackOutline className={'w-4 h-4'}/>} size={"sm"}/>
            </Link>
            <div>
                <TaskStateBadge state={task.state}/>
            </div>
        </header>
    );
};


export default TaskHeader;