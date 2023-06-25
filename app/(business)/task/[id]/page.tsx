import {Page} from "@/types";
import React from "react";
import TaskHeader from "./header";
import prisma from "@/lib/database";
import {notFound} from "next/navigation";
import SummaryContent from "./content";
import RefreshTask from "./refresh-task";
import {getFileUrl} from "@/lib/oss";
import {getCurrentUser} from "@/lib/auth";


const TaskDetail: Page<"id"> = async props => {
    const id = props.params.id as string | undefined;
    if (!id) {
        return notFound();
    }
    const user = await getCurrentUser();
    const task = await prisma.task.findUnique({
        select: {
            pdfHash: true,
            language: true,
            state: true
        },
        where: {id, userId: user.id}
    });
    if (!task) {
        return notFound();
    }
    const summary = await prisma.summary.findUnique({
        where: {
            pdfHash_language: {
                pdfHash: task.pdfHash,
                language: task.language
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

    const pdfUrl = getFileUrl("uploads", task.pdfHash + ".pdf");
    return <div>
        <TaskHeader task={task}/>
        <SummaryContent
            language={task.language}
            taskState={task.state}
            summary={summary}
            chats={chats}
            pdfUrl={pdfUrl}
            avatar={user.image}
        />
        <RefreshTask task={task}/>
    </div>
}
export default TaskDetail;