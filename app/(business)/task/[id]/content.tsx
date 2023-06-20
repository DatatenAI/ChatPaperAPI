'use client';
import React, {FC, useEffect, useRef, useState} from 'react';
import {useRouter} from "next/navigation";
import {Task, TaskState} from "@prisma/client";
import TaskStateBadge from "@/components/task-state-badge";
import {HiPaperAirplane} from "react-icons/hi2";

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


    return <div className={'w-full h-screen pt-16 flex'}>
        <div className={'w-3/5'}>
            qwe
        </div>
        <div className={'w-2/5 border-l relative'}>
            <div className={'w-full py-4  flex items-center  justify-between px-4 border-b'}>
                <div>
                    <p className={'font-medium text-lg'}>对话</p>
                    <div>

                    </div>

                </div>
                <TaskStateBadge state={props.task.state}/>
            </div>
            <div className={'w-full absolute bottom-0 left-0 py-4'}>
                <div
                    className={'w-4/5 rounded-lg py-4 pl-4 pr-0 mx-auto border shadow lg:max-w-2xl xl:max-w-3xl flex relative'}>
                    <textarea ref={textareaRef}
                              className='w-full pr-10 resize-none flex-grow max-h-48 overscroll-y-auto focus-visible:outline-none'
                              style={{height: textareaHeight}} onInput={onTextareaInput}/>
                    <button
                        className={'absolute bottom-3 right-4 w-8 h-8 p-2 rounded-md disabled:bg-white  disabled:text-gray-400 bg-primary text-white transition-colors disabled:opacity-40'}>
                        <HiPaperAirplane className={'w-4 h-4'}/>
                    </button>
                </div>
            </div>
        </div>
    </div>;
};


export default TaskContent;