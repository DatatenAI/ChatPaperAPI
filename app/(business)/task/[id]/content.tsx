'use client';
import React, {FC, useEffect, useRef, useState} from 'react';
import {useRouter} from "next/navigation";
import {Task, TaskState} from "@prisma/client";
import TaskStateBadge from "@/components/task-state-badge";
import {HiPaperAirplane} from "react-icons/hi2";
import Split from 'react-split'
import {Button} from "@/ui/button";
import {AiOutlineShareAlt} from "react-icons/ai";

const TaskContent: FC<{
    task: Task
}> = props => {
    const router = useRouter();
    const [refreshInterval, setRefreshInterval] = useState<ReturnType<typeof setInterval>>();
    const [textareaHeight, setTextareaHeight] = useState<number | 'auto'>(24);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (props.task.state === TaskState.RUNNING) {
            setRefreshInterval(setInterval(() => {
                router.refresh();
            }, 3000));
        }
        return () => {
            clearInterval(refreshInterval);
        };
    }, []);

    useEffect(() => {
        if (props.task.state !== TaskState.RUNNING) {
            clearInterval(refreshInterval);
        }
    }, [props.task]);

    const onTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const ele = textareaRef.current;
        if (ele) {
            ele.style.height = 'auto';
            ele.style.height = ele.scrollHeight + 'px';
        }
    }


    return <Split className={'w-full h-screen pt-16 flex [&>*:nth-child(2)]:bg-gray-200 [&>*:nth-child(2)]:cursor-col-resize'} gutterSize={1} minSize={400}>
        <div className={'w-1/2'}>
            qwe
        </div>
        <div className={'w-1/2 relative'}>
            <div className={'w-full py-4  flex items-center  justify-between px-4 border-b'}>
                <div>
                    <p className={'font-medium text-lg'}>对话</p>
                    <div>

                    </div>

                </div>
                <Button size={"sm"} variant={'ghost'} leftIcon={<AiOutlineShareAlt/>}/>
            </div>
            <div className={'w-full absolute bottom-0 left-0 py-4'}>
                <div
                    className={'w-4/5 rounded-lg py-4 pl-4 pr-0 mx-auto border shadow lg:max-w-2xl xl:max-w-3xl flex relative'}>
                    <textarea ref={textareaRef}
                              className='w-full pr-10 resize-none flex-grow max-h-48 break-all  focus-visible:outline-none'
                              onInput={onTextareaInput} rows={1}/>
                    <button
                        className={'absolute bottom-3 right-4 w-8 h-8 p-2 rounded-md disabled:bg-white  disabled:text-gray-400 bg-primary text-white transition-colors disabled:opacity-40'}>
                        <HiPaperAirplane className={'w-4 h-4'}/>
                    </button>
                </div>
            </div>
        </div>
    </Split>;
};


export default TaskContent;