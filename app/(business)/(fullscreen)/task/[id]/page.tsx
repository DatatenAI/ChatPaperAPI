import {Page} from "@/types";
import React from "react";
import Header from "../../header";
import prisma from "@/lib/database";
import {notFound} from "next/navigation";
import SummaryContent from "../../summary-content";
import RefreshTask from "./refresh-task";
import {getFileUrl} from "@/lib/oss";
import {getCurrentUser} from "@/lib/auth";
import TaskStateBadge from "@/components/task-state-badge";


const TaskDetail: Page<"id"> = async props => {
    const id = props.params.id as string | undefined;
    if (!id) {
        return notFound();
    }
    const user = (await getCurrentUser())!;
    // const task = await prisma.task.findUnique({
    //     select: {
    //         pdfHash: true,
    //         language: true,
    //         state: true,
    //         fileName: true
    //     },
    //     where: {
    //         id,
    //         userId: user.id
    //     }
    // });
    // if (!task) {
    //     return notFound();
    // }
    const summary = await prisma.summary.findUnique({
        where: {
            pdfHash_language: {
                pdfHash: "6377f7862dd377c0662cf91e8dcd83e7",
                language: "中文"
            }
        }
    });
    const chats = [];
    if (summary) {
        chats.push(...await prisma.chat.findMany({
                select: {
                    question: true,
                    reply: true,
                    status: true,
                },
                where: {
                    summaryId: summary.id,
                    userId: user.id,
                }
            })
        )
    }

    const pdfUrl = 'https://proceedings.mlr.press/v162/chae22a/chae22a.pdf';
    return <div>
        <Header logined title={"Robust Imitation Learning against Variations in Environment Dynamics"} extra={<TaskStateBadge state={'SUCCESS'}/>}/>
        <SummaryContent
            language={'中文'}
            taskState={'SUCCESS'}
            summary={summary}
            chats={chats}
            pdfUrl={pdfUrl}
            avatar={user.image}
            logined/>
        {/* <RefreshTask task={task}/> */}
    </div>
}
export default TaskDetail;