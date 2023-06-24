'use client';
import React, {FC, useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import {Task, TaskState} from "@prisma/client";
import Split from 'react-split'
import PdfViewer from "./pdf-viewer";
import Chat from "./chat";


const TaskContent: FC<{
    task: Pick<Task, 'pdfHash' | 'language' | 'state'>;
    pdfUrl: string
}> = props => {
    const router = useRouter();
    const [refreshInterval, setRefreshInterval] = useState<ReturnType<typeof setInterval>>();

    useEffect(() => {
        if (props.task.state === TaskState.RUNNING) {
            setRefreshInterval(setInterval(() => {
                router.refresh();
            }, 5000));
        }
        return () => {
            clearInterval(refreshInterval);
        };
    }, []);

    useEffect(() => {
        if (props.task.state !== TaskState.RUNNING) {
            clearInterval(refreshInterval);
        }
    }, [props.task, refreshInterval]);


    return <Split
        className={'w-full h-screen pt-16 flex'}
        minSize={400}>
        <PdfViewer pdfUrl={props.pdfUrl}/>
        <Chat disabled={props.task.state !== TaskState.SUCCESS} defaultMessages={[]}/>

    </Split>;
};


export default TaskContent;